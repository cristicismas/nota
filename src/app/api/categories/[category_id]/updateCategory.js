import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const updateCategory = async (req, params) => {
  const body = await req.json();

  if (!body) return res(400, { message: "No body present in the request" });

  const { category_id } = await params;

  if (!category_id) {
    return res(400, { message: "No category_id is given in the parameters" });
  }

  const { new_category } = body;

  if (!new_category) {
    return res(400, {
      message: "The request body requires a new_category",
    });
  }

  db.prepare(
    "UPDATE kanban_categories SET title = ? WHERE category_id = ?",
  ).run(new_category.title, category_id);

  return res(200, { message: "Category updated successfully." });
};

export default updateCategory;
