import db from "@/helpers/server/db.js";
import res from "@/helpers/server/res";

const getKanbanContent = async (params) => {
  const { tab_id } = await params;

  if (!tab_id) {
    return res(400, {
      message: "tab_id is not present in the request parameters",
    });
  }

  const categories =
    db
      .prepare(
        "SELECT * FROM kanban_categories WHERE tab_id = ? ORDER BY category_order ASC",
      )
      .all(tab_id) || [];

  const cards =
    db
      .prepare(
        "SELECT * FROM kanban_cards WHERE tab_id = ? ORDER BY card_order ASC",
      )
      .all(tab_id) || [];

  return res(200, { categories, cards });
};

export default getKanbanContent;
