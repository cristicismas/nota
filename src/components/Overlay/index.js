import Modal from "../Modal";
import styles from "./styles.module.css";

const Overlay = ({
  children,
  isOpen,
  handleClose,
  modalProps = {},
  className = "",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={handleClose}
      overlayClassName={styles.overlay}
      className={styles.innerOverlay}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      disableScroll
      {...modalProps}
      container="modal-container"
    >
      <div className={`${styles.mainContainer} ${className}`}>{children}</div>
    </Modal>
  );
};

export default Overlay;
