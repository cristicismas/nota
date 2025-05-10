import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const deleteCard = async (params) => {
  const { card_id } = await params;

  if (!card_id)
    return res(400, {
      message: "No card_id present in the request parameters",
    });

  const card_to_delete = db
    .prepare(
      "SELECT card_order, category_id, tab_id FROM kanban_cards WHERE card_id = ?",
    )
    .get(card_id);

  if (!card_to_delete) {
    return res(400, {
      message: "Given card_id was not found. No operation was performed.",
    });
  }

  const deleteResponse = db
    .prepare(
      "UPDATE kanban_cards SET deleted = 1, deleted_at = datetime('now') WHERE card_id = ?",
    )
    .run(card_id);

  if (deleteResponse.changes > 0) {
    db.prepare(
      "UPDATE tabs SET deleted_cards_count = deleted_cards_count + 1 WHERE tab_id = ?",
    ).run(card_to_delete.tab_id);
  }

  db.prepare(
    `DELETE FROM kanban_cards
     WHERE tab_id = ?
     AND deleted_at IS NOT NULL
     AND datetime(deleted_at) < datetime('now', '-14 days')
     ORDER BY deleted_at ASC
     LIMIT 1`,
  ).run(card_to_delete.tab_id);

  const all_cards = db
    .prepare(
      "SELECT * FROM kanban_cards WHERE category_id = ? AND deleted != 1 ORDER BY card_order ASC",
    )
    .all(card_to_delete.category_id);

  const all_cards_copy = [...all_cards];

  const updateQuery = db.prepare(
    "UPDATE kanban_cards SET card_order = ? WHERE card_id = ?",
  );

  const updateOrderTransaction = db.transaction(() => {
    all_cards.forEach((card, index) => {
      updateQuery.run(index, card.card_id);
      all_cards_copy[index].card_order = index;
    });
  });

  updateOrderTransaction();

  return res(200, {
    message: "Successfully deleted card",
    remaining_cards: all_cards_copy,
  });
};

export default deleteCard;
