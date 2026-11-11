const BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY; 

export const fetchPartsFromApi = async ({ number, brand, analogues }) => {
  const params = new URLSearchParams();
  params.append('key', API_KEY);
  params.append('number', encodeURIComponent(number));
  params.append('info', 'on'); 
  
  if (brand) {
    params.append('brand', encodeURIComponent(brand));
  }
  if (analogues) {
    params.append('analogues', analogues);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Сбой сети. Попробуйте позже.');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  if (data.goods && data.goods.length === 1 && !data.goods[0].goodsID) {
    return [];
  }

  return data.goods || [];
};