import { useState } from "react";
import useSWR from "swr";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StyledButton from "@/components/StyledButton";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import SimpleImage from "@/components/SimpleImage";
import Card from "../Card";
import styles from "./styles.module.css";
import CategoryPreview from "./CategoryPreview";

const CompactCategory = ({
  categoryData,
  categoryId,
  trash,
  draggingCard,
  handleDeleteCategory,
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCategoryPreview, setOpenCategoryPreview] = useState(null);
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

  if (isDragging && !trash)
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
      className={`${draggingCard ? styles.hasDraggingCard : ""} ${trash ? styles.trash : ""} ${styles.container}`}
    >
      {draggingCard && <Card hidden cardData={draggingCard} />}

      {trash ? (
        <StyledButton
          className={`${styles.button} ${styles.trash}`}
          onClick={() => setOpenCategoryPreview("trash")}
        >
          <SimpleImage
            disableLazyLoad
            src={"/icons/trash.svg"}
            width={22}
            height={22}
          />

          <div className={styles.title}>Trash</div>

          <div className={styles.count}>
            {isLoading ? "?" : data?.cards_count}
          </div>
        </StyledButton>
      ) : (
        <StyledButton
          className={styles.button}
          onClick={() => setOpenCategoryPreview(categoryId)}
        >
          <div className={styles.title}>{categoryData.title}</div>
          <div className={styles.count}>
            {isLoading ? "?" : data?.cards_count}
          </div>
        </StyledButton>
      )}

      {!trash && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenDeleteModal(true);
          }}
          className={styles.deleteButton}
        >
          <SimpleImage
            disableLazyLoad
            src={"/icons/close.svg"}
            width={20}
            height={20}
          />
        </button>
      )}

      <DeleteConfirmation
        isOpen={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        handleDelete={() => handleDeleteCategory(categoryId)}
        title={`Are you sure you want to delete "${categoryData?.title}"?`}
      />

      <CategoryPreview
        title={trash ? "Trash" : categoryData?.title}
        categoryId={openCategoryPreview}
        isOpen={openCategoryPreview !== null}
        handleClose={() => setOpenCategoryPreview(null)}
      />
    </div>
  );
};

export default CompactCategory;
