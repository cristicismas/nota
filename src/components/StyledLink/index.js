import Link from "next/link";
import styles from "./styles.module.css";

const StyledLink = ({ children, className = "", ...props }) => {
  return (
    <Link className={`${styles.link} ${className}`} {...props}>
      {children}
    </Link>
  );
};

export default StyledLink;
