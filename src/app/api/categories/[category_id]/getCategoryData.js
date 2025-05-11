import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const getCategoryData = async (params) => {
  const { category_id } = await params;

  if (!category_id) {
    return res(400, { message: "No category_id is given in the parameters" });
  }

  const cards = db
    .prepare(
      "SELECT * FROM kanban_cards WHERE category_id = ? AND deleted != 1 ORDER BY updated_at DESC",
    )
    .all(category_id);

  return res(200, { cards });
};

export default getCategoryData;
