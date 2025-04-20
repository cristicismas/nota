import Modal from "@/components/Modal";
import styles from "./styles.module.css";

const DeletePageModal = ({ isOpen, handleClose, handleDelete, pageTitle }) => {
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
      <div className={styles.deletePageContainer}>
        <div className={styles.modalTitle}>
          Are you sure you want to delete{" "}
          <span className={styles.noWrap}>"{pageTitle}" ?</span>
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
    </Modal>
  );
};

export default DeletePageModal;
