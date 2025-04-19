import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
// hooks
import useOutsideClick from "@/helpers/useOutsideClick";
// helpers
import setPageOverflow from "@/helpers/setPageOverflow";
// styles
import styles from "./styles.module.css";

const Modal = ({
  className,
  shouldCloseOnEsc,
  shouldCloseOnOverlayClick,
  disableScroll,
  overlayClassName,
  isOpen,
  setIsOpen,
  children,
  container = "modal-container",
}) => {
  const modalRef = useRef();

  const removeOnOutsideClick = () => {
    if (shouldCloseOnOverlayClick) {
      setIsOpen(false);
    }
  };

  useOutsideClick(modalRef, removeOnOutsideClick);

  useEffect(() => {
    if (shouldCloseOnEsc) {
      const closeModalOnEsc = (e) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };

      document.addEventListener("keydown", closeModalOnEsc);

      return () => {
        document.removeEventListener("keydown", closeModalOnEsc);
      };
    }
  }, [shouldCloseOnEsc]);

  useEffect(() => {
    if (!disableScroll) return;

    if (isOpen) {
      setPageOverflow(false);
    } else {
      setPageOverflow(true);
    }
    return () => {
      setPageOverflow(true);
    };
  }, [isOpen, disableScroll]);

  if (typeof window !== "undefined") {
    return ReactDOM.createPortal(
      isOpen && (
        <div className={`${overlayClassName} ${styles.overlay}`}>
          <div className={className}>
            <div ref={modalRef}>{children}</div>
          </div>
        </div>
      ),
      document.getElementById(container),
    );
  } else {
    return null;
  }
};

export default Modal;
