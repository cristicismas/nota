import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const getDeletedCards = (tab_id) => {
  return db
    .prepare(
      "SELECT COUNT(*) as card_count FROM kanban_cards WHERE deleted = 1 AND tab_id = ?",
    )
    .get(tab_id).card_count;
};

const getCategoryCardsCount = async (params) => {
  const { tab_id } = await params;

  if (!tab_id) {
    return res(400, { message: "No tab_id is given in the parameters" });
  }

  let deleted_cards_count = getDeletedCards(tab_id);
  return res(200, { deleted_cards_count });
};

export async function GET(_req, { params }) {
  return await getCategoryCardsCount(params);
}
