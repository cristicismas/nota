import { useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import styles from "./styles.module.css";
import StyledButton from "@/components/StyledButton";
import Column from "./Column";

const data = {
  title: "Dev Kanban",
  type: "kanban",
  categories: [
    {
      title: "Features",
      id: "features",
      cards: [
        {
          title: "first card",
          description: "first card description lorem ipsum",
        },
      ],
    },
    {
      title: "Bugs",
      id: "bugs",
      cards: [
        {
          title: "first card",
          description: "first card description lorem ipsum",
        },
      ],
    },
    {
      title: "TODO",
      id: "todo",
      cards: [
        {
          title: "first card",
          description: "first card description lorem ipsum",
        },
      ],
    },
    {
      title: "Done",
      id: "done",
      cards: [
        {
          title: "first card",
          description: "first card description lorem ipsum",
        },
      ],
    },
  ],
  order: 1,
};

const KanbanContent = () => {
  const [columns, setColumns] = useState(data.categories);
  const [activeDraggingColumn, setDraggingColumn] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Need to move stuff for this many pixels before the drag event starts
        distance: 10,
      },
    }),
  );

  const categoryIds = columns.map((c) => c.id);

  const onDragStart = (e) => {
    if (e.active.data.current?.type === "column") {
      setDraggingColumn(e.active.data.current.column);
    }
  };

  const onDragEnd = (e) => {
    setDraggingColumn(null);

    const { active, over } = e;

    if (!over) {
      return;
    }

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) {
      return;
    }

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (column) => column.id === activeColumnId,
      );
      const overColumnIndex = columns.findIndex(
        (column) => column.id === overColumnId,
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  console.log(activeDraggingColumn);

  return (
    <div className={styles.container}>
      <h1>KANBAN BOARD</h1>

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className={styles.columns}>
          <SortableContext items={categoryIds}>
            {columns.map((category) => (
              <Column
                data={category}
                key={category.id}
                className={styles.column}
                isDragging={category.id === activeDraggingColumn?.id}
              />
            ))}
          </SortableContext>

          <div className={styles.column}>
            <StyledButton
              className={styles.addCategoryButton}
              onClick={() => {
                setColumns([...columns, { title: "new category", cards: [] }]);
              }}
            >
              Add category
            </StyledButton>
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeDraggingColumn && <Column data={activeDraggingColumn} />}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};

export default KanbanContent;
