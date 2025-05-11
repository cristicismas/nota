import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const getCardsPerCategory = (cards) => {
  const cardsPerCategory = [];

  cards.forEach((card) => {
    const existingArrayIndex = cardsPerCategory.findIndex((arr) =>
      arr.find((c) => c.category_id === card.category_id),
    );

    if (existingArrayIndex >= 0) {
      cardsPerCategory[existingArrayIndex].push(card);
    } else {
      cardsPerCategory.push([card]);
    }
  });

  return cardsPerCategory;
};

const reorderCards = async (req) => {
  const body = await req.json();

  if (!body) return res(400, { message: "No body present in the request" });

  const { cards } = body;

  const cardsPerCategory = getCardsPerCategory(cards);

  if (!cards)
    return res(400, { message: "No cards present in the request body" });

  const updateQuery = db.prepare(
    "UPDATE kanban_cards SET card_order = ?, category_id = ?, updated_at = datetime('now') WHERE card_id = ?",
  );

  const updateTransaction = db.transaction(() => {
    cardsPerCategory.forEach((categoryArray) => {
      categoryArray.forEach((card) => {
        updateQuery.run(card.card_order, card.category_id, card.card_id);
      });
    });
  });

  updateTransaction();

  return res(200, { message: "Successfully reordered cards" });
};

export default reorderCards;
