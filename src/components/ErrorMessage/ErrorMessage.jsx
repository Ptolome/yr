import styles from './ErrorMessage.module.scss';

const ErrorMessage = ({ message }) => (
  <div className={styles.error}>
    <strong>Ошибка:</strong> {message}
  </div>
);
export default ErrorMessage;