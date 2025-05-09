import { useEffect, useRef, useState } from "react";
// components
import SimpleImage from "@/components/SimpleImage";
// styles
import styles from "./styles.module.css";

const RenameInput = ({ onSubmit, onAbort, defaultValue = "" }) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef();

  const handleSubmit = (formData) => {
    const newTitle = formData.get("rename-input");
    onSubmit(newTitle);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  useEffect(() => {
    const closeModalOnEsc = (e) => {
      if (e.key === "Escape") {
        onAbort();
      }
    };

    document.addEventListener("keydown", closeModalOnEsc);

    return () => {
      document.removeEventListener("keydown", closeModalOnEsc);
    };
  }, []);

  return (
    <form className={styles.form} action={handleSubmit}>
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        name="rename-input"
        title="Empty strings are not allowed in this input"
        autoComplete="off"
        pattern="^(?!\s*$).+"
        required
        className={styles.input}
        type="text"
      />

      <div className={styles.buttons}>
        <button
          type="submit"
          className={`${styles.button} ${styles.confirmButton}`}
        >
          <SimpleImage
            disableLazyLoad
            src={"/icons/checkmark.svg"}
            width={24}
            height={24}
          />
        </button>

        <button
          type="button"
          onClick={onAbort}
          className={`${styles.button} ${styles.abortButton}`}
        >
          <SimpleImage
            disableLazyLoad
            src={"/icons/close.svg"}
            width={24}
            height={24}
          />
        </button>
      </div>
    </form>
  );
};

export default RenameInput;
