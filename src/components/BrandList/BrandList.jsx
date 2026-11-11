import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalogs } from '../../store/partsSlice';
import styles from './BrandList.module.scss';

const BrandList = () => {
  const dispatch = useDispatch();

  const { brands, currentNumber, currentBrand, isSearchingBrands  } = useSelector(state => state.parts);

  const handleBrandClick = (brand) => {
    if (currentBrand === brand) return; 
    dispatch(fetchAnalogs({ number: currentNumber, brand }));
  };

  if (!isSearchingBrands && currentNumber && brands.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>По артикулу <strong>{currentNumber}</strong> производителей не найдено.</p>
        <span>Проверьте правильность ввода номера детали.</span>
      </div>
    );
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3>Выберите производителя:</h3>
      <div className={styles.list}>
        {brands.map((brand) => (
          <button 
            key={brand} 
            onClick={() => handleBrandClick(brand)}
            className={`${styles.brandBtn} ${currentBrand === brand ? styles.active : ''}`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandList;