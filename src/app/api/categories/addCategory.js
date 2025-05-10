import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const addCategory = async (req) => {
  const body = await req.json();

  if (!body) return res(400, { message: "No body present in the request" });

  const { tab_id, title, compact } = body;

  if (!tab_id || !title || typeof compact === "undefined") {
    return res(400, {
      message: "Not all required parameters are present in the body",
    });
  }

  const highestOrderCategory = db
    .prepare(
      "SELECT category_order FROM kanban_categories WHERE category_order = (SELECT MAX(category_order) FROM kanban_categories WHERE tab_id = ?)",
    )
    .get(tab_id);

  const new_category = {
    title: title,
    tab_id: tab_id,
    compact: compact ? 1 : 0,
    category_order: highestOrderCategory
      ? highestOrderCategory.category_order + 1
      : 0,
  };

  const info = db
    .prepare(
      "INSERT INTO kanban_categories (title, tab_id, category_order, compact) VALUES (@title, @tab_id, @category_order, @compact)",
    )
    .run(new_category);

  return res(200, {
    message: "Successfully added card",
    new_category: {
      ...new_category,
      category_id: info.lastInsertRowid,
    },
  });
};

export default addCategory;
