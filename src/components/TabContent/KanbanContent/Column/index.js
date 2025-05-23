import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useState, useMemo, memo } from "react";
import { CSS } from "@dnd-kit/utilities";
import styles from "./styles.module.css";
import StyledButton from "@/components/StyledButton";
import Card from "../Card";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import SimpleImage from "@/components/SimpleImage";
import RenameInput from "@/components/Sidebar/PagesList/PageLink/RenameInput";

const Column = ({
  editingCard,
  setEditingCard,
  columnData,
  cards = [],
  updateCards,
  renameColumn,
  deleteColumn,
  addCard,
  deleteCard,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(columnData.title);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${columnData?.category_id}`,
    data: {
      type: "column",
      column: columnData,
    },
  });

  const sortableStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const cardIds = useMemo(
    () => cards.map((card) => `card-${card.card_id}`),
    [cards],
  );

  const handleRenameColumn = (newTitle) => {
    setIsEditing(false);
    setTitle(newTitle);
    renameColumn({ ...columnData, title: newTitle });
  };

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
      <div className={`${styles.topBar} ${isEditing && styles.editing}`}>
        {!isEditing && (
          <button
            className={styles.deleteColumnButton}
            onClick={() => setOpenDeleteModal(true)}
          >
            <SimpleImage
              disableLazyLoad
              src="/icons/close.svg"
              width={22}
              height={22}
            />
          </button>
        )}

        {isEditing ? (
          <RenameInput
            defaultValue={columnData.title}
            onAbort={() => setIsEditing(false)}
            onSubmit={handleRenameColumn}
          />
        ) : (
          <div {...attributes} {...listeners} className={styles.columnTitle}>
            {title}
          </div>
        )}

        {!isEditing && (
          <button
            className={styles.renameColumnButton}
            onClick={() => setIsEditing(true)}
          >
            <SimpleImage
              disableLazyLoad
              src="/icons/rename.svg"
              width={22}
              height={22}
            />
          </button>
        )}
      </div>

      <div className={styles.cards}>
        <SortableContext items={cardIds}>
          {cards.map((card) => (
            <Card
              isEditing={editingCard === card.card_id}
              setIsEditing={setEditingCard}
              cardData={card}
              updateCards={updateCards}
              deleteCard={deleteCard}
              key={card.card_id}
            />
          ))}
        </SortableContext>
      </div>

      <div className={styles.actions}>
        <StyledButton
          onClick={() => addCard(columnData.category_id)}
          className={styles.addCardButton}
        >
          Add card
        </StyledButton>
      </div>

      <DeleteConfirmation
        isOpen={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleDelete={() => deleteColumn(columnData.category_id)}
        title={`Are you sure you want to delete "${columnData?.title}"?`}
      />
    </div>
  );
};

export default memo(Column);
