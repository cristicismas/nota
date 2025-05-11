import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const getDeletedCards = async (params) => {
  const { tab_id } = await params;

  if (!tab_id)
    return res(400, {
      message: "This request needs a tab_id",
    });

  const deletedCards = db
    .prepare("SELECT * FROM kanban_cards WHERE tab_id = ? AND deleted = 1")
    .all(tab_id);

  return res(200, { cards: deletedCards });
};

export async function GET(_req, { params }) {
  return await getDeletedCards(params);
}
