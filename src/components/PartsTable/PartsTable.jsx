import { useSelector } from 'react-redux';
import styles from './PartsTable.module.scss';

const PartsTable = ({ isLoading }) => {
  const { offers, currentBrand, currentNumber, partName } = useSelector(state => state.parts);
  console.log('offers', offers);

  if (!isLoading && currentBrand && offers.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
           <h3>Предложения для <strong>{currentBrand}</strong></h3>
        </div>
        <div className={styles.emptyState}>
          <p>Нет в наличии</p>
          <span>К сожалению, на складах нет предложений от этого производителя.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>Предложения для <strong>{currentBrand}</strong></h3>
          <span className={styles.subTitle}>{partName} ({currentNumber})</span>
        </div>
        {!isLoading && <span className={styles.countBadge}>Всего: {offers.length}</span>}
      </div>
      
      {isLoading && (
        <div className={styles.miniLoader}>
          <div className={styles.spinnerSmall}></div>
          <span>Загрузка предложений и аналогов...</span>
        </div>
      )}

      {!isLoading && offers.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Наименование / Бренд</th>
                <th>Артикул</th>
                <th>Цена (₽)</th>
                <th>Остаток</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className={`${offer.isAnalog ? styles.analogRow : ''} ${offer.notRefund ? styles.notRefundRow : ''}`}>
                  <td>
                    <div className={styles.nameCell}>
                      <span className={styles.name}>{offer.name}</span>
                      {offer.isAnalog && <span className={styles.analogBadge}>Аналог</span>}
                    </div>
                    <div className={styles.brand}>{offer.brand}</div>
                  </td>
                  <td>{offer.number}</td>
                  <td className={styles.price}>{offer.price.toFixed(2)}</td>
                  <td>{offer.stock} шт.</td>
                  <td>
                    <span className={`${styles.badge} ${offer.notRefund ? styles.badgeDanger : styles.badgeSuccess}`}>
                      {offer.notRefund ? 'Невозврат' : 'Возврат'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PartsTable;