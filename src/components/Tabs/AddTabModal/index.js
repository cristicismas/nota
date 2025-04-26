import Modal from "@/components/Modal";
import fetcher from "@/helpers/swrFetcher";
import styles from "./styles.module.css";
import { useState, useRef, useEffect } from "react";
import SpinningLoader from "@/components/SpinningLoader";

const AddTabModal = ({ isOpen, handleClose, page_id, handleFinished }) => {
  const [activeType, setActiveType] = useState("text");
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.select();
    }
  }, [isOpen]);

  const handleSubmit = async (formData) => {
    try {
      const title = formData.get("tab-title");
      setIsLoading(true);

      await fetcher("tab", {
        method: "POST",
        body: JSON.stringify({ page_id, title, tab_type: activeType }),
      });
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
    handleFinished();
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={handleClose}
      overlayClassName={styles.overlay}
      className={styles.innerOverlay}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      disableScroll
      container="modal-container"
    >
      <div className={styles.addTabContainer}>
        {isLoading ? (
          <SpinningLoader className={styles.loader} />
        ) : (
          <form action={handleSubmit}>
            <div className={styles.modalTitle}>Add a new tab:</div>

            <div className={styles.inputs}>
              <input
                ref={inputRef}
                className={styles.input}
                name="tab-title"
                type="text"
                autoFocus
                title="Empty strings are not allowed in this input"
                autoComplete="off"
                pattern="^(?!\s*$).+"
                required
                minLength={1}
                maxLength={100}
                defaultValue="New Tab"
              />

              <div
                className={styles.typeSelectContainer}
                data-selected-type={activeType}
              >
                <div className={styles.selectedIndicator} />
                <button
                  type="button"
                  className={styles.typeSelect}
                  onClick={() => setActiveType("text")}
                >
                  Text
                </button>

                <button
                  type="button"
                  className={styles.typeSelect}
                  onClick={() => setActiveType("kanban")}
                >
                  Kanban
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

              <button type="submit" className={styles.delete}>
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default AddTabModal;
