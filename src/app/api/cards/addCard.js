import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const addCard = async (req) => {
  const body = await req.json();

  if (!body) return res(400, { message: "No body present in the request" });

  const { category_id, tab_id } = body;

  if (!category_id || !tab_id) {
    return res(400, {
      message: "Not all required parameters are present in the body",
    });
  }

  const highestOrderCard = db
    .prepare(
      "SELECT * FROM kanban_cards WHERE card_order = (SELECT MAX(card_order) FROM kanban_cards WHERE category_id = ?)",
    )
    .get(category_id);

  const card_order = highestOrderCard ? highestOrderCard?.card_order + 1 : 0;

  const description = JSON.stringify([
    { type: "paragraph", children: [{ text: "" }] },
  ]);

  const new_card = db
    .prepare(
      "INSERT INTO kanban_cards ( category_id, tab_id, title, description, generation, card_order, deleted ) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(category_id, tab_id, "", description, 0, card_order, 0);

  return res(200, {
    message: "Successfully added card",
    card_id: new_card.lastInsertRowid,
    card_order,
  });
};

export default addCard;
