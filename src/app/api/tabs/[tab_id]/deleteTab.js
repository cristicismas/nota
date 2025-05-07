import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const deleteTab = async (params) => {
  const { tab_id } = await params;

  if (!tab_id) {
    return res(400, { message: "No tab_id is given in the parameters" });
  }

  const tab_to_delete = db
    .prepare("SELECT tab_order, page_id FROM tabs WHERE tab_id = ?")
    .get(tab_id);

  if (!tab_to_delete) {
    return res(400, {
      message: "Given tab_id was not found. No operation was performed.",
    });
  }

  db.prepare("DELETE FROM tabs WHERE tab_id = ?").run(tab_id);

  const all_tabs = db
    .prepare("SELECT tab_id FROM tabs WHERE page_id = ? ORDER BY tab_order ASC")
    .all(tab_to_delete.page_id);

  const updateQuery = db.prepare(
    "UPDATE tabs SET tab_order = ? WHERE tab_id = ?",
  );

  const updateOrderTransaction = db.transaction(() => {
    all_tabs.forEach((tab, index) => {
      updateQuery.run(index, tab.tab_id);
    });
  });

  updateOrderTransaction();

  return res(200, { message: "Tab successfully deleted" });
};

export default deleteTab;
