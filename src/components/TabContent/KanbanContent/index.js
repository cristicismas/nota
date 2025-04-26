import { useState, useMemo } from "react";
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
import Card from "./Card";

const data = {
  title: "Dev Kanban",
  type: "kanban",
  categories: [
    {
      title: "Features",
      id: "features",
    },
    {
      title: "Bugs",
      id: "bugs",
    },
    {
      title: "TODO",
      id: "todo",
    },
    {
      title: "Done",
      id: "done",
    },
  ],
  cards: [
    {
      id: "card1",
      categoryId: "features",
      title: "first card",
      description: "first card description lorem ipsum",
    },
    {
      id: "card2",
      categoryId: "features",
      title: "second card",
      description: "first card description lorem ipsum",
    },
    {
      id: "card3",
      categoryId: "features",
      title: "third card",
      description: "first card description lorem ipsum",
    },
    {
      id: "card4",
      categoryId: "features",
      title: "fourth card",
      description: "first card description lorem ipsum",
    },
    {
      id: "card5",
      categoryId: "features",
      title: "fifth card",
      description: "first card description lorem ipsum",
    },
  ],
  order: 1,
};

const KanbanContent = () => {
  const [columns, setColumns] = useState(data.categories);
  const [cards, setCards] = useState(data.cards);
  const [activeDraggingColumn, setDraggingColumn] = useState(null);
  const [activeDraggingCard, setDraggingCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Need to move stuff for this many pixels before the drag event starts
        distance: 10,
      },
    }),
  );

  const categoryIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const onDragStart = (e) => {
    if (e.active.data.current?.type === "column") {
      setDraggingColumn(e.active.data.current.column);
      return;
    }

    if (e.active.data.current?.type === "card") {
      setDraggingCard(e.active.data.current.card);
      return;
    }
  };

  const onDragEnd = (e) => {
    setDraggingColumn(null);
    setDraggingCard(null);

    const { active, over } = e;

    if (!over) {
      return;
    }

    if (over.data.current?.type === "column") {
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

  const onDragOver = (e) => {
    // Dirty hack to fix infinite recursion issue with react-dnd...
    setTimeout(() => {
      const { active, over } = e;

      if (!over) {
        return;
      }

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) {
        return;
      }

      const isActiveCard = active.data.current?.type === "card";
      const isOverCard = over.data.current?.type === "card";

      if (!isActiveCard) return;

      // If dropping a card over another card
      if (isActiveCard && isOverCard) {
        setCards(() => {
          const activeIndex = cards.findIndex((c) => c.id === activeId);
          const overIndex = cards.findIndex((c) => c.id === overId);

          if (cards[activeIndex].categoryId !== cards[overIndex].categoryId) {
            cards[activeIndex].categoryId = cards[overIndex].categoryId;
          }

          return arrayMove(cards, activeIndex, overIndex);
        });
      }
      if (isOverCard) console.log("over card: ", over.id, over.data.current);

      // If dropping a card over a column
      const isOverColumn = over.data.current.type === "column";
      if (isOverColumn) console.log("over column");

      if (isActiveCard && isOverColumn) {
        setCards(() => {
          const activeIndex = cards.findIndex((c) => c.id === activeId);

          if (cards[activeIndex].categoryId !== overId) {
            cards[activeIndex].categoryId = overId;
          }

          // Switches indexes in the same place, we use this to trigger a re-render
          return arrayMove(cards, activeIndex, activeIndex);
        });
      }
    }, 0);
  };

  const addCard = () => {
    setCards((cards) => [
      ...cards,
      {
        id: Math.random().toString(),
        categoryId: "bugs",
        title: "eigth card",
        description: "first card description lorem ipsum",
      },
    ]);
  };

  const deleteCard = () => {};

  return (
    <div className={styles.container}>
      <h1>KANBAN BOARD</h1>

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className={styles.columns}>
          <SortableContext items={categoryIds}>
            {columns.map((category) => (
              <Column
                columnData={category}
                key={category.id}
                className={styles.column}
                addCard={addCard}
                deleteCard={deleteCard}
                cards={cards.filter((card) => card.categoryId === category.id)}
              />
            ))}
          </SortableContext>

          <div className={styles.column}>
            <StyledButton
              className={styles.addCategoryButton}
              onClick={() => {
                setColumns(columns.slice(0, columns.length - 1));
              }}
            >
              Remove category
            </StyledButton>

            <br />
            <br />

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
            {activeDraggingColumn && (
              <Column
                columnData={activeDraggingColumn}
                className={styles.column}
                cards={cards.filter(
                  (card) => card.categoryId === activeDraggingColumn.id,
                )}
              />
            )}
            {activeDraggingCard && (
              <Card cardData={activeDraggingCard} deleteCard={deleteCard} />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};

export default KanbanContent;
