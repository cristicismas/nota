import { useState } from "react";
import { memo } from "react";
import styles from "./styles.module.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditField from "./EditField";
import SimpleImage from "@/components/SimpleImage";
import fetcher from "@/helpers/swrFetcher";
import EditOverlay from "./EditOverlay";

const Card = ({
  cardData,
  isEditing,
  setIsEditing,
  updateCards,
  deleteCard,
  isDragged,
  hidden,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `card-${cardData?.card_id}`,
    data: {
      type: "card",
      card: cardData,
    },
  });

  const sortableStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleCardTitleChange = async (newTitle, generation) => {
    if (generation <= cardData.generation) return;

    const newCard = {
      ...cardData,
      title: newTitle,
      generation,
      deleted: 0,
    };

    try {
      await fetcher(`cards/${cardData?.card_id}`, {
        method: "PUT",
        body: JSON.stringify(newCard),
      });
      updateCards(newCard);
    } catch (err) {
      if (err.status === 409) {
        console.info("Got an out of order error");
      } else {
        console.error(err);
      }
    }
  };

  if (hidden) {
    return (
      <div
        ref={setNodeRef}
        style={sortableStyle}
        className={`${styles.card} ${styles.hidden} ${styles.draggingPlaceholder}`}
      />
    );
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={sortableStyle}
        className={`${styles.card} ${styles.draggingPlaceholder}`}
      />
    );
  }

  if (isEditing) {
    return (
      <div className={`${styles.card} ${styles.editing}`}>
        <EditField
          generation={cardData.generation}
          defaultValue={cardData.title}
          onExit={() => setIsEditing(null)}
          onUpdate={handleCardTitleChange}
        />
      </div>
    );
  }

  const onCardChange = (newCard) => {
    updateCards(newCard);
  };

  const defaultDescription = JSON.stringify([
    { type: "paragraph", children: [{ text: "" }] },
  ]);

  return (
    <>
      <div
        onClick={() => setIsEditing(cardData.card_id)}
        ref={setNodeRef}
        style={sortableStyle}
        {...attributes}
        {...listeners}
        className={`${isDragged && styles.dragged} ${styles.card}`}
      >
        <div className={styles.cardTitle}>{cardData.title}</div>

        <button
          className={styles.actionButton}
          onClick={(e) => {
            e.stopPropagation();
            deleteCard(cardData.card_id);
          }}
        >
          <SimpleImage
            disableLazyLoad
            src="/icons/checkmark.svg"
            width={22}
            height={22}
          />
        </button>

        {defaultDescription !== cardData.description && (
          <div className={styles.hasDescriptionIndicator}>
            <SimpleImage
              disableLazyLoad
              src="/icons/description.svg"
              width={18}
              height={18}
            />
          </div>
        )}

        <button
          className={styles.openDescriptionButton}
          onClick={(e) => {
            e.stopPropagation();
            setOpenModal(true);
          }}
        >
          <SimpleImage
            disableLazyLoad
            src="/icons/edit.svg"
            width={14}
            height={14}
          />
        </button>
      </div>

      <EditOverlay
        cardData={cardData}
        isOpen={openModal}
        onCardChange={onCardChange}
        handleClose={() => setOpenModal(false)}
      />
    </>
  );
};

export default memo(Card);
