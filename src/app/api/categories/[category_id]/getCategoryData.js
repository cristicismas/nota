import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const getCategoryData = async (params) => {
  const { category_id } = await params;

  if (!category_id) {
    return res(400, { message: "No category_id is given in the parameters" });
  }

  // TODO: get cards here for compact category

  return res(200, { cards: [] });
};

export default getCategoryData;
