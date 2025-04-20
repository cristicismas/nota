import { useSWRConfig } from "swr";
import { useEffect, useRef } from "react";
import useOutsideClick from "@/helpers/useOutsideClick";
import fetcher from "@/helpers/swrFetcher";
import SimpleImage from "@/components/SimpleImage";
import styles from "./styles.module.css";

const PageCreationInput = ({ abort, onFinished }) => {
  const { mutate } = useSWRConfig();
  const inputRef = useRef();
  const formRef = useRef();

  const addPage = async (pageTitle) => {
    const newPage = await fetcher("page", {
      method: "POST",
      body: JSON.stringify({ pageTitle }),
    });

    await mutate((key) => {
      if (key === "pages") return true;
      if (key.startsWith("pages/")) return true;

      return false;
    });
    onFinished(newPage);
  };

  const handleSubmit = (formData) => {
    const pageTitle = formData.get("page-title-input");
    inputRef.current.blur();
    addPage(pageTitle);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  }, []);

  useOutsideClick(formRef, () => {
    if (inputRef?.current?.value) {
      inputRef.current.blur();
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
