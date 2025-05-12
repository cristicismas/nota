import Modal from "../Modal";
import styles from "./styles.module.css";

const Overlay = ({
  children,
  isOpen,
  handleClose,
  modalProps = {},
  containerClassName = "",
  className = "",
  mountPoint = "modal-container",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={handleClose}
      overlayClassName={styles.overlay}
      className={`${styles.innerOverlay} ${containerClassName}`}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      disableScroll
      {...modalProps}
      container={mountPoint}
    >
      <div className={`${styles.mainContainer} ${className}`}>{children}</div>
    </Modal>
  );
};

export default Overlay;
