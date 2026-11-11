import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPartsFromApi } from '../api/partsApi';


export const fetchBrands = createAsyncThunk(
  'parts/fetchBrands',
  async (number, { rejectWithValue }) => {
    try {
      const goods = await fetchPartsFromApi({ number });
      
      // Проверка на "товар не найден"
      if (!goods || (goods.length === 1 && !goods[0].goodsID)) {
        return rejectWithValue('По данному запросу нет предложений');
      }

      const uniqueBrands = [...new Set(goods.map(item => item.brand).filter(Boolean))];
      const partName = goods.length > 0 ? goods[0].name : '';

      return { number, brands: uniqueBrands, partName };
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка поиска');
    }
  }
);


export const fetchAnalogs = createAsyncThunk(
  'parts/fetchAnalogs',
  async ({ number, brand }, { rejectWithValue }) => {
    try {
      const goods = await fetchPartsFromApi({ number, brand, analogues: 'on' });
      
      const flatOffers = [];

      goods.forEach(good => {
        // 1. Основной товар
        if (good.warehouses && good.warehouses.length > 0) {
          good.warehouses.forEach(wh => {
            flatOffers.push({
              id: `${good.goodsID}-${wh.id}-main`,
              name: good.name,
              brand: good.brand,
              number: good.number,
              price: wh.price,
              stock: wh.stock,
              shipmentDate: wh.shipmentDate,
              notRefund: wh.notRefund || good.notRefund,
              isAnalog: false
            });
          });
        }
        

        if (good.analogues && Array.isArray(good.analogues)) {
          good.analogues.forEach(analog => {
            if (analog.count > 0) {
               flatOffers.push({
                id: `${analog.brand}-${analog.number}-analog`,
                name: analog.name || good.name,
                brand: analog.brand,
                number: analog.number || good.number,
                price: analog.price || 0,
                stock: analog.count,
                shipmentDate: new Date().toISOString(),
                notRefund: analog.notRefund || false,
                isAnalog: true
              });
            }
          });
        }
      });
      

      if (flatOffers.length === 0) {
        return rejectWithValue('Аналогов нет');
      }
      
      return flatOffers;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка загрузки предложений');
    }
  }
);

const partsSlice = createSlice({
  name: 'parts',
  initialState: {
    currentNumber: '',
    currentBrand: '',
    partName: '',
    brands: [],
    offers: [],
    isSearchingBrands: false,
    isFetchingOffers: false,
    error: null,
  },
  reducers: {
    resetToStep1: (state) => {
      state.currentNumber = '';
      state.currentBrand = '';
      state.partName = '';
      state.brands = [];       
      state.offers = [];      
      state.error = null;    
      state.isSearchingBrands = false;
      state.isFetchingOffers = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.isSearchingBrands = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.isSearchingBrands = false;
        state.currentNumber = action.payload.number;
        state.partName = action.payload.partName;
        state.brands = action.payload.brands;
        state.offers = []; 
        state.currentBrand = '';
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isSearchingBrands = false;
        state.error = action.payload;
      })
      

      .addCase(fetchAnalogs.pending, (state) => {
        state.isFetchingOffers = true;
        state.error = null;

      })
      .addCase(fetchAnalogs.fulfilled, (state, action) => {
        state.isFetchingOffers = false;
        state.offers = action.payload;
        state.currentBrand = action.meta.arg.brand; 
      })
      .addCase(fetchAnalogs.rejected, (state, action) => {
        state.isFetchingOffers = false;
        state.error = action.payload;
        state.offers = [];       
        state.currentBrand = ''; 
      });
  }
});

export const { resetToStep1 } = partsSlice.actions;
export default partsSlice.reducer;