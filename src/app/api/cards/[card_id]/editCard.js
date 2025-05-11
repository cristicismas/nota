import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const editCard = async (req, params) => {
  const body = await req.json();
  const { card_id } = await params;

  if (!card_id)
    return res(400, {
      message: "No card_id present in the request parameters",
    });

  if (!body) return res(400, { message: "No body present in the request" });

  const { category_id, title, description, card_order, generation, deleted } =
    body;

  if (isNaN(card_order)) {
    return res(400, {
      message: "This request needs a card_order",
    });
  }

  if (!category_id) {
    return res(400, {
      message: "This request needs a category_id",
    });
  }

  if (typeof title !== "string" && typeof description !== "string") {
    return res(400, {
      message: "This requests needs either a new title or a new description",
    });
  }

  if (isNaN(generation)) {
    return res(400, { message: "Generation is not a number." });
  }

  const last_card_generation = db
    .prepare("SELECT generation FROM kanban_cards WHERE card_id = ?")
    .get(card_id)?.generation;

  if (
    typeof last_card_generation !== "undefined" &&
    last_card_generation >= generation
  ) {
    return res(409, {
      message: "Out of order generation. Skipping this edit...",
    });
  }

  db.prepare(
    "UPDATE kanban_cards SET title = ?, description = ?, card_order = ?, generation = ?, deleted = ? WHERE card_id = ?",
  ).run(title, description, card_order, generation, deleted, card_id);

  return res(200, {
    message: "Successfully updated card",
  });
};

export default editCard;
