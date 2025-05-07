import db from "@/helpers/server/db.js";
import res from "@/helpers/server/res";

const deletePage = async (params) => {
  const page_id = await params.page;

  if (!page_id) {
    return res(400, { message: "No page_id given in the parameters" });
  }

  const info = db.prepare("DELETE FROM pages WHERE page_id = ?").run(page_id);

  if (info.changes === 0) {
    return res(400, {
      message: "Given page_id was not found. No operation was performed.",
    });
  }

  return res(200, { message: "Page successfully deleted" });
};

export default deletePage;
