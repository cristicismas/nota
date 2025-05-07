import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const renameTab = async (req, params) => {
  const { tab_id } = await params;

  const body = await req.json();

  if (!tab_id) {
    return res(400, {
      message: "tab_id is not present in the request parameters",
    });
  }

  if (!body) {
    return res(400, { message: "No body present in the request" });
  }

  const { title } = body;

  const info = db
    .prepare("UPDATE tabs SET title = ? WHERE tab_id = ?")
    .run(title, tab_id);

  if (info.changes === 0) {
    return res(400, {
      message: "Given tab_id was not found. No operation was performed.",
    });
  }

  return res(200, { message: "Tab renamed successfully" });
};

export default renameTab;
