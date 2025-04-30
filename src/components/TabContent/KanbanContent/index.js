import { useState, useMemo, useCallback, useEffect } from "react";
import useSWR from "swr";
import { createPortal } from "react-dom";
import fetcher from "@/helpers/swrFetcher";
// dnd
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
// components
import StyledButton from "@/components/StyledButton";
import Column from "./Column";
import Card from "./Card";
import SpinningLoaderPage from "@/components/SpinningLoaderPage";
import SimpleImage from "@/components/SimpleImage";
import ErrorContent from "@/components/ErrorContent";
// styles
import styles from "./styles.module.css";

const KanbanContent = ({ tab_id }) => {
  const { data, isLoading, error, mutate } = useSWR(`tabs/${tab_id}`);

  const [columns, setColumns] = useState(data?.categories);
  const [cards, setCards] = useState(data?.cards);
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

  useEffect(() => {
    setColumns(data?.categories);
    setCards(data?.cards);
  }, [data]);

  const categoryIds = useMemo(
    () => (columns ? columns.map((c) => c.category_id) : []),
    [columns],
  );

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

    if (!over || !active) {
      return;
    }

    if (
      over.data.current?.type !== "column" &&
      active.data.current?.type !== "column"
    ) {
      return;
    }

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) {
      return;
    }

    const activeColumnIndex = columns.findIndex(
      (column) => column.category_id === activeColumnId,
    );

    const overColumnIndex = columns.findIndex(
      (column) => column.category_id === overColumnId,
    );

    if (activeColumnIndex < 0 || overColumnIndex < 0) return;

    const newColumns = arrayMove(
      columns,
      activeColumnIndex,
      overColumnIndex,
    ).map((c, index) => ({ ...c, category_order: index }));

    fetcher("categories", {
      method: "PUT",
      body: JSON.stringify({ type: "order", new_categories: newColumns }),
    });

    setColumns(newColumns);
  };

  const onDragOver = (e) => {
    // Stupid workaround to avoid a bug with dnd kit that causes infinite recursion
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
        const cardsCopy = structuredClone(cards);
        const activeIndex = cardsCopy.findIndex((c) => c.card_id === activeId);
        const overIndex = cardsCopy.findIndex((c) => c.card_id === overId);

        if (
          cardsCopy[activeIndex].categoryId !== cardsCopy[overIndex].categoryId
        ) {
          cardsCopy[activeIndex].categoryId = cardsCopy[overIndex].categoryId;
        }

        const newCards = arrayMove(cardsCopy, activeIndex, overIndex);
        setCards(newCards);
      }

      // If dropping a card over a column
      const isOverColumn = over.data.current.type === "column";

      if (isActiveCard && isOverColumn) {
        const activeIndex = cards.findIndex((c) => c.card_id === activeId);

        const cardsCopy = structuredClone(cards);

        if (cardsCopy[activeIndex].categoryId !== overId) {
          cardsCopy[activeIndex].categoryId = overId;
          setCards(cardsCopy);
        }
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

  const getCategoryCards = useCallback(
    (category) => cards.filter((card) => card.categoryId === category.id),
    [cards],
  );

  const handleAddCategory = async () => {
    const newCategory = {
      tab_id,
      title: "Category Title",
    };

    try {
      const { new_category } = await fetcher("category", {
        method: "POST",
        body: JSON.stringify(newCategory),
      });

      setColumns([...columns, new_category]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (category_id) => {
    await fetcher(`category/${category_id}`, { method: "DELETE" });
    await mutate(`tabs/${tab_id}`);
  };

  const handleRenameCategory = async (new_category) => {
    await fetcher(`categories/${new_category?.category_id}`, {
      method: "PUT",
      body: JSON.stringify({
        new_category,
      }),
    });

    const newColumns = columns.map((col) => {
      if (col.category_id === new_category.category_id) {
        return new_category;
      }
      return col;
    });

    setColumns(newColumns);
  };

  if (error) {
    return <ErrorContent error={error} />;
  }

  if (isLoading) {
    return <SpinningLoaderPage />;
  }

  return (
    <div className={styles.container}>
      <DndContext
        collisionDetection={pointerWithin}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className={styles.columns}>
          <SortableContext items={categoryIds}>
            {columns?.map((category) => {
              return (
                <Column
                  columnData={category}
                  key={category.category_id}
                  className={styles.column}
                  addCard={addCard}
                  deleteCard={deleteCard}
                  deleteColumn={handleDeleteCategory}
                  renameColumn={handleRenameCategory}
                  cards={getCategoryCards(category)}
                />
              );
            })}
          </SortableContext>

          <div className={styles.column}>
            <StyledButton
              className={styles.addCategoryButton}
              onClick={handleAddCategory}
            >
              <SimpleImage
                disableLazyLoad
                src={"/icons/plus.svg"}
                width={16}
                height={16}
              />
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
