import styles from "./styles.module.css";

const ErrorContent = ({ error }) => (
  <div className={styles.container}>
    <div className={styles.status}>{error?.status}</div>
    <div className={styles.message}>{error?.message}</div>
  </div>
);

export default ErrorContent;
