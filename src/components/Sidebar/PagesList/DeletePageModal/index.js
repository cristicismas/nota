import Overlay from "@/components/Overlay";
import styles from "./styles.module.css";

const DeletePageModal = ({ isOpen, handleClose, handleDelete, pageTitle }) => {
  return (
    <Overlay isOpen={isOpen} handleClose={handleClose}>
      <div className={styles.deletePageContainer}>
        <div className={styles.modalTitle}>
          Are you sure you want to delete <br />"{pageTitle}"?
        </div>
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

export default DeletePageModal;
