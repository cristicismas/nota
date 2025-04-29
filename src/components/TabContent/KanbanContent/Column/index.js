import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, memo } from "react";
import { CSS } from "@dnd-kit/utilities";
import styles from "./styles.module.css";
import StyledButton from "@/components/StyledButton";
import Card from "../Card";
import SimpleImage from "@/components/SimpleImage";

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
    id: columnData?.category_id,
    data: {
      type: "column",
      column: columnData,
    },
  });

  const sortableStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const cardIds = useMemo(() => cards.map((card) => card.card_id), [cards]);

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
      <div className={styles.topBar}>
        <div {...attributes} {...listeners} className={styles.columnTitle}>
          {columnData.title}
        </div>

        <button
          className={styles.deleteColumnButton}
          onClick={() => deleteColumn(columnData.category_id)}
        >
          <SimpleImage src="/icons/close.svg" width={22} height={22} />
        </button>
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

export default memo(Column);
