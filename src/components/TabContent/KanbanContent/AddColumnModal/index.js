import fetcher from "@/helpers/swrFetcher";
import styles from "./styles.module.css";
import { useState, useRef, useEffect } from "react";
import SpinningLoader from "@/components/SpinningLoader";
import Overlay from "@/components/Overlay";

const AddColumnModal = ({ isOpen, handleClose, tab_id, handleFinished }) => {
  const [activeType, setActiveType] = useState("normal");
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.select();
    }
  }, [isOpen]);

  const handleSubmit = async (formData) => {
    const title = formData.get("category-title");

    const newCategory = {
      tab_id,
      title,
      compact: activeType === "compact" ? true : false,
    };

    try {
      setIsLoading(true);

      const res = await fetcher("categories", {
        method: "POST",
        body: JSON.stringify(newCategory),
      });

      handleFinished(res.new_category);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
    handleClose();
  };

  return (
    <Overlay isOpen={isOpen} handleClose={handleClose}>
      <div className={styles.addTabContainer}>
        {isLoading ? (
          <SpinningLoader className={styles.loader} />
        ) : (
          <form action={handleSubmit}>
            <div className={styles.modalTitle}>Add a new category:</div>

            <div className={styles.inputs}>
              <input
                ref={inputRef}
                className={styles.input}
                name="category-title"
                type="text"
                autoFocus
                title="Empty strings are not allowed in this input"
                autoComplete="off"
                pattern="^(?!\s*$).+"
                required
                minLength={1}
                maxLength={100}
                defaultValue="New Category"
              />

              <div
                className={styles.typeSelectContainer}
                data-selected-type={activeType}
              >
                <div className={styles.selectedIndicator} />
                <button
                  type="button"
                  className={styles.typeSelect}
                  onClick={() => setActiveType("normal")}
                >
                  Normal
                </button>

                <button
                  type="button"
                  className={styles.typeSelect}
                  onClick={() => setActiveType("compact")}
                >
                  Compact
                </button>
              </div>
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                className={styles.abort}
                onClick={handleClose}
              >
                Abort
              </button>

              <button type="submit" className={styles.submit}>
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </Overlay>
  );
};

export default AddColumnModal;
