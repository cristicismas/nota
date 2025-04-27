import { useSWRConfig } from "swr";
import { useEffect, useRef } from "react";
import fetcher from "@/helpers/swrFetcher";
// components
import SimpleImage from "@/components/SimpleImage";
import StyledButton from "@/components/StyledButton";
// styles
import styles from "./styles.module.css";

const PageCreationInput = ({ abort, onFinished, currentPages }) => {
  const { mutate } = useSWRConfig();
  const inputRef = useRef();
  const formRef = useRef();

  const addPage = async (pageTitle) => {
    const newPage = await fetcher("page", {
      method: "POST",
      body: JSON.stringify({ pageTitle }),
    });

    await mutate("pages", currentPages, {
      revalidate: true,
      optimisticData: false,
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

  return (
    <form ref={formRef} className={styles.form} action={handleSubmit}>
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          className={styles.input}
          name="page-title-input"
          type="text"
          title="Empty strings are not allowed in this input"
          autoComplete="off"
          pattern="^(?!\s*$).+"
          required
          minLength={1}
          maxLength={100}
          defaultValue="New Page"
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
            className={`${styles.button} ${styles.closeButton}`}
            onClick={abort}
          >
            <SimpleImage
              disableLazyLoad
              src={"/icons/close.svg"}
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      <StyledButton type="submit" className={styles.addPage}>
        <SimpleImage
          disableLazyLoad
          src={"/icons/plus.svg"}
          width={18}
          height={18}
        />
        <span>Add page</span>
      </StyledButton>
    </form>
  );
};

export default PageCreationInput;
