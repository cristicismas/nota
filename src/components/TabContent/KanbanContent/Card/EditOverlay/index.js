import SimpleImage from "@/components/SimpleImage";
import Overlay from "@/components/Overlay";
import styles from "./styles.module.css";
import { useState } from "react";

const EditOverlay = ({ isOpen, handleClose, cardData }) => {
  const [titleValue, setTitleValue] = useState(cardData.title);
  const [descriptionValue, setDescriptionValue] = useState(
    cardData.description,
  );

  const handleTitleChange = async (e) => {
    if (e.target.value.includes("\n")) return;
    setTitleValue(e.target.value);
  };

  return (
    <Overlay
      isOpen={isOpen}
      handleClose={handleClose}
      className={styles.overlay}
    >
      <button className={styles.closeModalButton} onClick={handleClose}>
        <SimpleImage
          disableLazyLoad
          src="/icons/close.svg"
          width={28}
          height={28}
        />
      </button>
      <div className={styles.innerContainer}>
        <div className={styles.title}>Edit Card</div>
        <div className={styles.label}>Title</div>
        <textarea
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={handleTitleChange}
          className={styles.titleTextArea}
          value={titleValue}
          autoFocus
        />

        <div className={styles.descriptionContainer}>
          <div className={styles.label}>Description</div>
          {cardData.description && (
            <div className={styles.title}>{cardData.description}</div>
          )}
        </div>
      </div>
    </Overlay>
  );
};

export default EditOverlay;
