import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const deleteCategory = async (params) => {
  const { category_id } = await params;

  if (!category_id) {
    return res(400, { message: "No category_id is given in the parameters" });
  }

  const category_to_delete = db
    .prepare(
      "SELECT category_order, category_id FROM kanban_categories WHERE category_id = ?",
    )
    .get(category_id);

  if (!category_to_delete) {
    return res(400, {
      message: "Given category_id was not found. No operation was performed.",
    });
  }

  db.prepare("DELETE FROM kanban_categories WHERE category_id = ?").run(
    category_id,
  );

  const all_categories = db
    .prepare(
      "SELECT category_id FROM kanban_categories WHERE category_id = ? ORDER BY category_order ASC",
    )
    .all(category_to_delete.category_id);

  const updateQuery = db.prepare(
    "UPDATE kanban_categories SET category_order = ? WHERE category_id = ?",
  );

  const updateOrderTransaction = db.transaction(() => {
    all_categories.forEach((category, index) => {
      updateQuery.run(index, category.category_id);
    });
  });

  updateOrderTransaction();

  return res(200, { message: "Category successfully deleted" });
};

export default deleteCategory;
