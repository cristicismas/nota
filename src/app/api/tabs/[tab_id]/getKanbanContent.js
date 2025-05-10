import db from "@/helpers/server/db.js";
import res from "@/helpers/server/res";

const getSplitCategories = (categories) => {
  let normalCategories = [];
  let compactCategories = [];

  categories.forEach((category) => {
    if (category.compact === 1) {
      compactCategories.push(category);
    } else {
      normalCategories.push(category);
    }
  });

  return [normalCategories, compactCategories];
};

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

  // TODO: don't bring the cards for compact categories, make a separate endpoint with pagination for this
  const [normalCategories, compactCategories] = getSplitCategories(categories);

  const cards =
    db
      .prepare(
        "SELECT * FROM kanban_cards WHERE tab_id = ? AND deleted != 1 ORDER BY card_order ASC",
      )
      .all(tab_id) || [];

  return res(200, { normalCategories, compactCategories, cards });
};

export default getKanbanContent;
