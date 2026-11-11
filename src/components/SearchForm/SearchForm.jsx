import { useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands, resetToStep1 } from '../../store/partsSlice';
import styles from './SearchForm.module.scss';

const SearchForm = () => {
  const [number, setNumber] = useState('');
  const dispatch = useDispatch();
  const { partName, isSearchingBrands, error } = useSelector(state => state.parts);

  const handleChange = (e) => {
    const value = e.target.value;
    setNumber(value);

    if (!value.trim()) {
      dispatch(resetToStep1());
      return;
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (number.trim()) {
      dispatch(fetchBrands(number.trim()));
    } else {
      dispatch(resetToStep1());
    }
  };

  return (<>
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={number}
          onChange={handleChange}
          placeholder="Введите артикул детали"
          className={`${styles.input} ${error && !partName ? styles.inputError : ''}`}
        />
        
       
      </div>
      
      <button type="submit" className={styles.button} disabled={!number.trim() || isSearchingBrands}>
        {isSearchingBrands ? 'Поиск...' : 'Найти производителей'}
      </button>

      
    </form>

        {!isSearchingBrands && partName && !error && (
          <div className={styles.partInfo}>
            Найдено: <strong>{partName}</strong>
          </div>
        )}

        {error && !isSearchingBrands && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        </>
  );
};

export default SearchForm;