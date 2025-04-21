import Link from "next/link";
import styles from "./styles.module.css";

const StyledButton = ({
  children,
  className = "",
  href,
  onClick,
  type,
  ...props
}) => {
  if (href) {
    return (
      <Link className={`${styles.button} ${className}`} href={href} {...props}>
        {children}
      </Link>
    );
  } else if (onClick || type) {
    return (
      <button
        className={`${styles.button} ${className}`}
        onClick={onClick}
        type={type}
        {...props}
      >
        {children}
      </button>
    );
  } else {
    return (
      <div className={`${styles.button} ${className}`} {...props}>
        {children}
      </div>
    );
  }
};

export default StyledButton;
