import { useEffect } from "react";
import SimpleImage from "../SimpleImage";
import styles from "./styles.module.css";

const SearchButton = ({ setOpenSearch, className }) => {
  useEffect(() => {
    const shortcutHandler = async (e) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setOpenSearch();
      }
    };

    document.addEventListener("keydown", shortcutHandler);

    return () => {
      document.removeEventListener("keydown", shortcutHandler);
    };
  }, []);

  return (
    <button
      onClick={setOpenSearch}
      className={`${styles.searchButton} ${className}`}
    >
      <SimpleImage
        disableLazyLoad
        className={styles.searchIcon}
        src={"/icons/search.svg"}
        width={18}
        height={18}
      />
      <span>Search</span>

      <span className={styles.hint}>Ctrl+K</span>
    </button>
  );
};

export default SearchButton;
