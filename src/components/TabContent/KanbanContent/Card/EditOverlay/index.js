import SimpleImage from "@/components/SimpleImage";
import RichTextEditor from "@/components/RichTextEditor";
import Overlay from "@/components/Overlay";
import styles from "./styles.module.css";
import { useRef, useEffect, useState, startTransition } from "react";
import fetcher from "@/helpers/swrFetcher";

const EditOverlay = ({ isOpen, handleClose, onCardChange, cardData }) => {
  const [titleValue, setTitleValue] = useState(cardData.title);
  const [descriptionValue, setDescriptionValue] = useState(
    cardData.description,
  );

  const upToDateTitleValue = useRef(cardData.title);
  const initialCardTitle = useRef(cardData.title);

  const upToDateDescriptionValue = useRef(cardData.description);
  const initialCardDescription = useRef(cardData.description);

  const editGeneration = useRef(cardData.generation || 0);

  const updateCard = async (newCard) => {
    if (editGeneration.current <= cardData.generation) return;

    onCardChange(newCard);
    await fetcher(`cards/${newCard.card_id}`, {
      method: "PUT",
      body: JSON.stringify(newCard),
    });
  };

  useEffect(() => {
    if (editGeneration.current <= cardData.generation) return;
    const newCard = {
      ...cardData,
      title: upToDateTitleValue.current,
      generation: editGeneration.current,
    };

    const debounce = setTimeout(() => {
      if (initialCardTitle.current !== titleValue) {
        updateCard(newCard);
      }
    }, 200);

    return () => {
      clearTimeout(debounce);
    };
  }, [titleValue]);

  useEffect(() => {
    if (editGeneration.current <= cardData.generation) return;

    const newCard = {
      ...cardData,
      description: upToDateDescriptionValue.current,
      generation: editGeneration.current,
    };

    const debounce = setTimeout(() => {
      if (initialCardDescription.current !== descriptionValue) {
        updateCard(newCard);
      }
    }, 200);

    return () => {
      clearTimeout(debounce);
    };
  }, [descriptionValue]);

  useEffect(() => {
    return () => {
      if (!isOpen) {
        if (
          upToDateTitleValue.current !== initialCardTitle.current ||
          upToDateDescriptionValue.current !== initialCardDescription.current
        ) {
          editGeneration.current += 1;

          const newCard = {
            ...cardData,
            title: upToDateTitleValue.current,
            description: upToDateDescriptionValue.current,
            generation: editGeneration.current,
          };

          updateCard(newCard);
        }
      }
    };
  }, [isOpen]);

  const handleTitleChange = async (e) => {
    if (e.target.value.includes("\n")) return;

    editGeneration.current += 1;
    setTitleValue(e.target.value);
    upToDateTitleValue.current = e.target.value;
  };

  const handleDescriptionChange = async (value) => {
    startTransition(() => {
      editGeneration.current += 1;
      setDescriptionValue(value);
      upToDateDescriptionValue.current = value;
    });
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
        <h1 className={styles.title}>Edit Card</h1>

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

          <RichTextEditor
            className={styles.description}
            data={{ text_content: descriptionValue }}
            onChange={handleDescriptionChange}
          />
        </div>
      </div>
    </Overlay>
  );
};

export default EditOverlay;
