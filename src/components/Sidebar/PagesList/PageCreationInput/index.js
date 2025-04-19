import { useEffect, useRef } from "react";
import useOutsideClick from "@/helpers/useOutsideClick";
import styles from "./styles.module.css";
import SimpleImage from "@/components/SimpleImage";

const PageCreationInput = ({ addPage, abort }) => {
  const inputRef = useRef();
  const formRef = useRef();

  const handleSubmit = (formData) => {
    const pageTitle = formData.get("page-title-input");
    addPage(pageTitle);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  useOutsideClick(formRef, () => {
    if (inputRef?.current?.value) {
      addPage(inputRef.current.value);
    }
  }, []);

  return (
    <form ref={formRef} className={styles.form} action={handleSubmit}>
      <input
        ref={inputRef}
        className={styles.input}
        name="page-title-input"
        type="text"
        minLength={1}
        maxLength={100}
        defaultValue={"New Page"}
      />

      <button type="button" className={styles.closeButton} onClick={abort}>
        <SimpleImage
          disableLazyLoad
          src={"/icons/close.svg"}
          width={24}
          height={24}
        />
      </button>
    </form>
  );
};

export default PageCreationInput;
