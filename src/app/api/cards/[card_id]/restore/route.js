import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const restoreCardToFirstCategory = (card) => {
  const first_category_id = db
    .prepare(
      "SELECT category_id FROM kanban_categories WHERE tab_id = ? AND compact = 0 ORDER BY category_order ASC",
    )
    .get(card.tab_id)?.category_id;

  if (!first_category_id) {
    return false;
  } else {
    const last_category_card =
      db
        .prepare(
          "SELECT card_order FROM kanban_cards WHERE category_id = ? AND deleted != 1 ORDER BY card_order DESC",
        )
        .get(first_category_id)?.card_order || -1;

    db.prepare(
      "UPDATE kanban_cards SET category_id = ?, card_order = ? WHERE card_id = ?",
    ).run(first_category_id, last_category_card + 1, card.card_id);
  }

  return first_category_id;
};

export async function PUT(req, { params }) {
  const body = await req.json();

  const { card_id } = await params;

  if (!card_id)
    return res(400, {
      message: "No card_id present in the request parameters",
    });

  if (!body) return res(400, { message: "No body present in the request" });

  const { card } = body;

  const restored_to = restoreCardToFirstCategory(card);

  if (!restored_to) {
    return res(400, {
      message:
        "Cannot restore the card, there are no non-compact categories to restore to.",
    });
  }

  if (card.deleted === 1) {
    db.prepare(
      "UPDATE kanban_cards SET deleted = 0, deleted_at = NULL WHERE card_id = ?",
    ).run(card_id);
  }

  return res(200, {
    message: "Successfully restored card to a non-compact category.",
    restored_to,
  });
}
