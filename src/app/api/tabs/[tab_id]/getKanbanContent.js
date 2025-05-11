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

const getCardsPerCategory = (category_id) => {
  return db
    .prepare(
      "SELECT COUNT(*) as card_count FROM kanban_cards WHERE category_id = ?",
    )
    .get(category_id).card_count;
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

  const [normalCategories, compactCategories] = getSplitCategories(categories);

  const cards =
    db
      .prepare(
        `SELECT * FROM kanban_cards WHERE tab_id = ? AND deleted != 1 AND category_id NOT IN (${compactCategories.map(() => "?").join(",")}) ORDER BY card_order ASC`,
      )
      .all(tab_id, ...compactCategories.map((c) => c.category_id)) || [];

  const deletedCardsCount = db
    .prepare("SELECT deleted_cards_count FROM tabs WHERE tab_id = ?")
    .get(tab_id)?.deleted_cards_count;

  const compactCategoriesWithCount = compactCategories.map((category) => ({
    ...category,
    count: getCardsPerCategory(category.category_id),
  }));

  return res(200, {
    normalCategories,
    compactCategories: compactCategoriesWithCount,
    cards,
    deletedCardsCount,
  });
};

export default getKanbanContent;
