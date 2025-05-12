import { useState, useMemo, useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr";
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
import AddColumnModal from "./AddColumnModal";
import CompactCategory from "./CompactCategory";
// styles
import styles from "./styles.module.css";

const KanbanContent = ({ tab_id }) => {
  const { data, isLoading, error, mutate } = useSWR(`tabs/${tab_id}`);

  const [columns, setColumns] = useState(data?.normalCategories);
  const [compactCategories, setCompactCategories] = useState(
    data?.compactCategories,
  );

  const [cards, setCards] = useState(data?.cards);
  const [activeDraggingCompact, setDraggingCompact] = useState(null);
  const [activeDraggingColumn, setDraggingColumn] = useState(null);
  const [activeDraggingCard, setDraggingCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [openAddColumnModal, setOpenAddColumnModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Need to move stuff for this many pixels before the drag event starts
        distance: 10,
      },
    }),
  );

  useEffect(() => {
    setCompactCategories(data?.compactCategories);
    setColumns(data?.normalCategories);
    setCards(data?.cards);
  }, [data]);

  const categoryIds = useMemo(
    () => (columns ? columns.map((c) => `column-${c.category_id}`) : []),
    [columns],
  );

  const compactCategoryIds = useMemo(
    () =>
      compactCategories
        ? compactCategories.map((c) => `compact-${c.category_id}`)
        : [],
    [compactCategories],
  );

  const onDragStart = (e) => {
    if (e.active.data.current?.type === "compact") {
      setDraggingCompact(e.active.data.current.compact);
      return;
    }

    if (e.active.data.current?.type === "column") {
      setDraggingColumn(e.active.data.current.column);
      return;
    }

    if (e.active.data.current?.type === "card") {
      setDraggingCard(e.active.data.current.card);
      return;
    }
  };

  const onDragEnd = async (e) => {
    setDraggingCompact(null);
    setDraggingColumn(null);
    setDraggingCard(null);

    const { active, over } = e;

    if (!over || !active) {
      return;
    }

    if (
      active.data.current?.type === "compact" &&
      over.data.current?.type === "compact"
    ) {
      const activeCompactId = getDragId(active.id);
      const overCompactId = getDragId(over.id);
      const activeCompactIndex = compactCategories.findIndex(
        (compact) => compact.category_id === activeCompactId,
      );

      const overCompactIndex = compactCategories.findIndex(
        (compact) => compact.category_id === overCompactId,
      );

      if (activeCompactIndex < 0 || overCompactIndex < 0) return;

      const newCompacts = arrayMove(
        compactCategories,
        activeCompactIndex,
        overCompactIndex,
      ).map((c, index) => ({ ...c, category_order: index }));

      fetcher("categories", {
        method: "PUT",
        body: JSON.stringify({ type: "order", new_categories: newCompacts }),
      });

      setCompactCategories(newCompacts);
    }

    // Reorder cards
    if (active.data.current?.type === "card") {
      const activeId = getDragId(active.id);
      const overId = getDragId(over.id);

      if (overId === "trash") {
        await deleteCard(activeId);
        return;
      } else {
        await fetcher("cards", {
          method: "PUT",
          body: JSON.stringify({ cards }),
        });
      }
    }

    if (over.data.current?.type === "compact") {
      const activeId = getDragId(active.id);
      const overId = getDragId(over.id);
      globalMutate(`categories/${overId}/cards_count`);
      setCards(cards.filter((card) => card.card_id !== activeId));
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

  const getDragId = (id) => Number(id?.split("-")?.[1]) || id?.split("-")?.[1];

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

      const isOverCompact = over.data.current.type === "compact";

      if (isActiveCard && isOverCompact) {
        const activeIndex = cards.findIndex((c) => c.card_id === activeId);

        const cardsCopy = structuredClone(cards);
        cardsCopy[activeIndex].category_id = overId;
        setCards(getOrderedCards(cardsCopy));
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

    const response = await fetcher("cards", {
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
    globalMutate(`tabs/${tab_id}/cards_count`);
  };

  const getCategoryCards = (category) =>
    cards.filter((card) => card.category_id === category.category_id);

  const handleDeleteCategory = async (category_id) => {
    await fetcher(`categories/${category_id}`, { method: "DELETE" });
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

  // TODO: improve animation when dropping a card in a compact category (maybe fade it out)
  // TODO: improve revalidation UI when deleting a category
  // TODO: improve revalidation UI when adding a category

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
            onClick={() => setOpenAddColumnModal(true)}
          >
            <SimpleImage
              disableLazyLoad
              src={"/icons/plus.svg"}
              width={16}
              height={16}
            />
          </StyledButton>
        </div>

        <div className={styles.compactCategories}>
          <SortableContext items={compactCategoryIds}>
            {compactCategories?.map((category) => (
              <CompactCategory
                key={category.category_id}
                categoryData={category}
                categoryId={category.category_id}
                handleDeleteCategory={handleDeleteCategory}
                // need to keep current dragging card in the dom so dnd-kit doesn't lose track of it
                draggingCard={cards?.find(
                  (card) => card.category_id === category.category_id,
                )}
              />
            ))}

            <CompactCategory
              trash
              tabId={tab_id}
              categoryId="trash"
              draggingCard={cards?.find((card) => card.category_id === "trash")}
            />
          </SortableContext>
        </div>

        <AddColumnModal
          tab_id={tab_id}
          handleClose={() => setOpenAddColumnModal(false)}
          handleFinished={(newCategory) => {
            if (newCategory.compact) {
              setCompactCategories([...compactCategories, newCategory]);
            } else {
              setColumns([...columns, newCategory]);
            }
          }}
          isOpen={openAddColumnModal}
        />

        {createPortal(
          <DragOverlay>
            {activeDraggingColumn && (
              <Column
                columnData={activeDraggingColumn}
                className={styles.column}
                cards={getCategoryCards(activeDraggingColumn)}
              />
            )}
            {activeDraggingCompact && (
              <CompactCategory categoryData={activeDraggingCompact} />
            )}
            {activeDraggingCard && (
              <Card
                cardData={activeDraggingCard}
                deleteCard={deleteCard}
                isDragged
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};

export default KanbanContent;
