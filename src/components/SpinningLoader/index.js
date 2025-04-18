// styles
import styles from "./styles.module.css";

const SpinningLoader = ({ className = "" }) => (
  <div className={`${className} ${styles.loader}`} />
);

export default SpinningLoader;
