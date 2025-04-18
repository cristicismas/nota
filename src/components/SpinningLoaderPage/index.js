// components
import SpinningLoader from "../SpinningLoader";
// styles
import styles from "./styles.module.css";

const SpinningLoaderPage = () => (
  <div className={`${styles.container} ${styles.loading}`}>
    <SpinningLoader className={styles.spinner} />
  </div>
);

export default SpinningLoaderPage;
