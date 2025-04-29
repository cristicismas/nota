import Overlay from "@/components/Overlay";
import styles from "./styles.module.css";

const DeleteConfirmation = ({ isOpen, handleClose, handleDelete, title }) => {
  return (
    <Overlay isOpen={isOpen} handleClose={handleClose}>
      <div className={styles.deletePageContainer}>
        <div className={styles.modalTitle}>{title}</div>
        <div className={styles.buttons}>
          <button className={styles.abort} onClick={handleClose}>
            Abort
          </button>
          <button className={styles.delete} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default DeleteConfirmation;
