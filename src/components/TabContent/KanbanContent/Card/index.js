import styles from "./styles.module.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Card = ({ cardData, deleteCard }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cardData?.id,
    data: {
      type: "card",
      card: cardData,
    },
  });

  const sortableStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
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

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      {...attributes}
      {...listeners}
      className={styles.card}
      key={cardData.id}
    >
      <div className={styles.cardTitle}>{cardData.title}</div>
    </div>
  );
};

export default Card;
