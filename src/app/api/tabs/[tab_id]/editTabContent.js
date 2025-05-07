import db from "@/helpers/server/db.js";
import res from "@/helpers/server/res.js";

const editTabContent = async (req, params) => {
  const tab_id = await params.tab_id;

  if (!tab_id) {
    return res(400, {
      message: "tab_id is not present in the request parameters",
    });
  }

  const body = await req.json();

  if (!body) {
    return res(400, { message: "No body present in the request" });
  }

  const { tab_type, text_content, generation } = body;

  if (!tab_type || !text_content || isNaN(generation)) {
    return res(400, {
      message: "Request body doesn't have all the required data.",
    });
  }

  const lastTabGeneration = db
    .prepare("SELECT generation FROM tabs WHERE tab_id = ?")
    .get(tab_id)?.generation;

  if (lastTabGeneration >= generation) {
    return res(409, {
      message: "Out of order generation. Skipping this edit...",
    });
  }

  if (tab_type === "text") {
    db.prepare(
      "UPDATE tabs SET text_content = ?, generation = ? WHERE tab_id = ?",
    ).run(text_content, generation, tab_id);
  } else if (tab_type === "kanban") {
    return res(400, { message: "Unimplemented page type handler." });
  } else {
    return res(400, { message: "Unimplemented page type handler." });
  }

  return res(200, { message: "Sucessfully updated text_content" });
};

export default editTabContent;
