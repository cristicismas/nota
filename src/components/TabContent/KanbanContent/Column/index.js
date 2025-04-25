import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./styles.module.css";

const Column = ({ data, isDragging, className }) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: data.id,
      data: {
        type: "column",
        column: data,
      },
    });

  const sortableStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={sortableStyle}
        className={`${styles.draggingPlaceholder} ${className}`}
      ></div>
    );

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      className={`${styles.contentColumn} ${className}`}
    >
      <div {...attributes} {...listeners} className={styles.columnTitle}>
        {data.title}
      </div>
      <div className={styles.cards}>
        {data.cards.map((card, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.cardTitle}>{card.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Column;
