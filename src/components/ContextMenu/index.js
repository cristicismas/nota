import { useRef } from "react";
import { createPortal } from "react-dom";
// helpers
import useOutsideClick from "@/helpers/useOutsideClick";
// styles
import styles from "./styles.module.css";

const ContextMenu = ({ isOpen, handleClose, children, position }) => {
  const menuRef = useRef();

  useOutsideClick(menuRef, handleClose);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.container}>
      <div
        style={{ left: position?.x, top: position.y }}
        className={styles.contextMenu}
        ref={menuRef}
      >
        {children}
      </div>
    </div>,
    document.getElementById("context-menu"),
  );
};

export default ContextMenu;
