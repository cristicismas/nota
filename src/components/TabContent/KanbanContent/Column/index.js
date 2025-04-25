import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { CSS } from "@dnd-kit/utilities";
import styles from "./styles.module.css";
import StyledButton from "@/components/StyledButton";
import Card from "../Card";

const Column = ({
  columnData,
  cards = [],
  renameColumn,
  deleteColumn,
  addCard,
  deleteCard,
  className,
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnData?.id,
    data: {
      type: "column",
      column: columnData,
    },
  });

  const sortableStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const cardIds = useMemo(() => cards.map((card) => card.id), [cards]);

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={sortableStyle}
        className={`${styles.draggingPlaceholder} ${className}`}
      />
    );

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      className={`${styles.contentColumn} ${className}`}
    >
      <div {...attributes} {...listeners} className={styles.columnTitle}>
        {columnData.title}
      </div>

      <div className={styles.cards}>
        <SortableContext items={cardIds}>
          {cards.map((card) => (
            <Card cardData={card} deleteCard={deleteCard} key={card.id} />
          ))}
        </SortableContext>
      </div>

      <div className={styles.actions}>
        <StyledButton onClick={addCard} className={styles.addCardButton}>
          Add card
        </StyledButton>
      </div>
    </div>
  );
};

export default Column;
