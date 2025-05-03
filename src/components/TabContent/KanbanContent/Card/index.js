import { useState } from "react";
import { memo } from "react";
import styles from "./styles.module.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditField from "./EditField";
import SimpleImage from "@/components/SimpleImage";
import fetcher from "@/helpers/swrFetcher";

const Card = ({ cardData, updateCards, deleteCard }) => {
  const [isEditing, setIsEditing] = useState(false);

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
    };

    try {
      await fetcher(`card/${cardData?.card_id}`, {
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
          onExit={() => setIsEditing(false)}
          onUpdate={handleCardTitleChange}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      ref={setNodeRef}
      style={sortableStyle}
      {...attributes}
      {...listeners}
      className={styles.card}
    >
      <div className={styles.cardTitle}>{cardData.title}</div>

      <button
        className={styles.deleteCardButton}
        onClick={(e) => {
          e.stopPropagation();
          deleteCard(cardData.card_id);
        }}
      >
        <SimpleImage
          disableLazyLoad
          src="/icons/close.svg"
          width={22}
          height={22}
        />
      </button>
    </div>
  );
};

export default memo(Card);
