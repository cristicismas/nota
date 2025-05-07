import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const OP_TYPE = {
  ORDER: "order",
};

const updateCategories = async (req) => {
  const body = await req.json();

  if (!body) return res(400, { message: "No body present in the request" });

  const { type, new_categories } = body;

  if (!type) {
    return res(400, {
      message:
        "This request requires a `type` parameter in the body for the operation to be performed.",
    });
  }

  if (!new_categories || !Array.isArray(new_categories)) {
    return res(400, {
      message: "The request body requires an array of new_categories",
    });
  }

  switch (type) {
    case OP_TYPE.ORDER:
      updateCategoriesOrder(new_categories);

      return res(200, { message: "Successfully updated categories order." });
    default:
      return res(400, {
        message: "Invalid operation type found.",
      });
  }
};

const updateCategoriesOrder = (new_categories) => {
  new_categories.forEach((category) => {
    db.prepare(
      "UPDATE kanban_categories SET category_order = ? WHERE category_id = ?",
    ).run(category.category_order, category.category_id);
  });
};

export default updateCategories;
