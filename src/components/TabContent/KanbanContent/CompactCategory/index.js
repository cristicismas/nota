import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StyledButton from "@/components/StyledButton";
import SimpleImage from "@/components/SimpleImage";
import styles from "./styles.module.css";
import Card from "../Card";
import useSWR from "swr";

const CompactCategory = ({ categoryData, categoryId, trash, draggingCard }) => {
  const { data, isLoading } = useSWR(`categories/${categoryId}/cards_count`);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `compact-${trash ? "trash" : categoryId}`,
    data: {
      type: "compact",
      compact: categoryData,
    },
  });

  const sortableStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging)
    return (
      <div
        className={styles.draggingPlaceholder}
        ref={setNodeRef}
        style={sortableStyle}
      ></div>
    );

  return (
    <div
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={sortableStyle}
      className={`${draggingCard ? styles.hasDraggingCard : ""} ${styles.container}`}
    >
      {draggingCard && <Card hidden cardData={draggingCard} />}

      {trash ? (
        <StyledButton
          className={`${styles.button} ${styles.trash}`}
          onClick={() => {}}
        >
          <SimpleImage
            disableLazyLoad
            src={"/icons/trash.svg"}
            width={22}
            height={22}
          />

          <div className={styles.title}>Trash</div>

          <div className={styles.deletedCount}>
            {isLoading ? "?" : data?.cards_count}
          </div>
        </StyledButton>
      ) : (
        <StyledButton className={styles.button} onClick={() => {}}>
          <div className={styles.title}>{categoryData.title}</div>
          <div className={styles.deletedCount}>
            {isLoading ? "?" : data?.cards_count}
          </div>
        </StyledButton>
      )}
    </div>
  );
};

export default CompactCategory;
