import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { createPortal } from "react-dom";
import fetcher from "@/helpers/swrFetcher";
import { getOrderedCards, findLastCardInCategory } from "@/helpers/cards";
// dnd
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
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
  const [editingCard, setEditingCard] = useState(null);

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
    () => (columns ? columns.map((c) => `column-${c.category_id}`) : []),
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

    // Reorder cards
    if (active.data.current?.type === "card") {
      fetcher("cards", { method: "PUT", body: JSON.stringify({ cards }) });
    }

    if (
      over.data.current?.type !== "column" ||
      active.data.current?.type !== "column"
    ) {
      return;
    }

    const activeColumnId = getDragId(active.id);
    const overColumnId = getDragId(over.id);

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

  const getDragId = (id) => Number(id?.split("-")?.[1]);

  const onDragOver = (e) => {
    // Stupid workaround to avoid a bug with dnd kit that causes infinite recursion
    setTimeout(() => {
      const { active, over } = e;

      if (!over) {
        return;
      }

      const activeId = getDragId(active.id);
      const overId = getDragId(over.id);

      if (active.id === over.id) {
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
          cardsCopy[activeIndex].category_id !==
          cardsCopy[overIndex].category_id
        ) {
          cardsCopy[activeIndex].category_id = cardsCopy[overIndex].category_id;

          const newCards = arrayMove(
            cardsCopy,
            activeIndex,
            Math.max(0, overIndex - 1),
          );
          setCards(getOrderedCards(newCards));
        } else {
          const newCards = arrayMove(cardsCopy, activeIndex, overIndex);
          setCards(getOrderedCards(newCards));
        }
      }

      // If dropping a card over a column
      const isOverColumn = over.data.current.type === "column";

      if (isActiveCard && isOverColumn) {
        const activeIndex = cards.findIndex((c) => c.card_id === activeId);

        const cardsCopy = structuredClone(cards);

        cardsCopy[activeIndex].category_id = overId;
        const lastColIndex = findLastCardInCategory(
          cardsCopy,
          cardsCopy[activeIndex].category_id,
        );
        const newCards = arrayMove(cardsCopy, activeIndex, lastColIndex);
        setCards(getOrderedCards(newCards));
      }
    }, 0);
  };

  const addCard = async (category_id) => {
    const description = JSON.stringify([
      { type: "paragraph", children: [{ text: "" }] },
    ]);

    const newCard = {
      tab_id,
      category_id,
      title: "",
      description,
      generation: 0,
    };

    const response = await fetcher(`card`, {
      method: "POST",
      body: JSON.stringify(newCard),
    });

    newCard.card_id = response.card_id;
    newCard.card_order = response.card_order;

    setCards((cards) => [...cards, newCard]);
    setEditingCard(response.card_id);
  };

  const deleteCard = async (card_id) => {
    const response = await fetcher(`cards/${card_id}`, {
      method: "DELETE",
    });

    const remainingCardsInCategory = response.remaining_cards;

    const updatedCards = cards.filter((card) => card.card_id !== card_id);

    // Update order for cards
    for (const card of remainingCardsInCategory) {
      const cardIndex = updatedCards.findIndex(
        (c) => c.card_id === card.card_id,
      );

      if (cardIndex >= 0) {
        updatedCards[cardIndex] = card;
      } else {
        console.error("Cannot find card to update order: ", card);
      }
    }

    setCards(updatedCards);
  };

  const getCategoryCards = (category) =>
    cards.filter((card) => card.category_id === category.category_id);

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

  const updateCards = (updatedCard) => {
    const updatedCardIndex = cards.findIndex(
      (c) => c.card_id === updatedCard.card_id,
    );
    const cardsCopy = structuredClone(cards);
    cardsCopy[updatedCardIndex] = updatedCard;
    setCards(cardsCopy);
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
                  editingCard={editingCard}
                  setEditingCard={setEditingCard}
                  columnData={category}
                  key={category.category_id}
                  className={styles.column}
                  addCard={addCard}
                  deleteCard={deleteCard}
                  deleteColumn={handleDeleteCategory}
                  renameColumn={handleRenameCategory}
                  cards={getCategoryCards(category)}
                  updateCards={updateCards}
                />
              );
            })}
          </SortableContext>
        </div>

        <div className={styles.buttonContainer}>
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

        {createPortal(
          <DragOverlay>
            {activeDraggingColumn && (
              <Column
                columnData={activeDraggingColumn}
                className={styles.column}
                cards={getCategoryCards(activeDraggingColumn)}
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
