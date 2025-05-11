import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const getCardsPerCategory = (category_id) => {
  return db
    .prepare(
      "SELECT COUNT(*) as card_count FROM kanban_cards WHERE category_id = ? AND deleted != 1",
    )
    .get(category_id).card_count;
};

const getDeletedCards = () => {
  return db
    .prepare(
      "SELECT COUNT(*) as card_count FROM kanban_cards WHERE deleted = 1",
    )
    .get().card_count;
};

const getCategoryCardsCount = async (params) => {
  const { category_id } = await params;

  if (!category_id) {
    return res(400, { message: "No category_id is given in the parameters" });
  }

  let cards_count = 0;
  if (category_id === "trash") {
    cards_count = getDeletedCards();
  } else {
    cards_count = getCardsPerCategory(category_id);
  }

  return res(200, { cards_count });
};

export async function GET(_req, { params }) {
  return await getCategoryCardsCount(params);
}
