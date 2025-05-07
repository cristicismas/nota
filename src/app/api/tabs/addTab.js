import db from "@/helpers/server/db.js";
import res from "@/helpers/server/res.js";

const addTab = async (req) => {
  const body = await req.json();

  if (!body) return res(400, { message: "No body present in the request" });

  const { page_id, title, tab_type } = body;

  if (!page_id || !title || !tab_type)
    return res(400, {
      message: "Not all required parameters are present in the body",
    });

  const addTextTabQuery = db.prepare(
    "INSERT INTO tabs (title, page_id, tab_type, text_content, generation, tab_order) VALUES (@title, @page_id, @tab_type, @text_content, @generation, @tab_order)",
  );

  const addKanbanTabQuery = db.prepare(
    "INSERT INTO tabs (title, page_id, tab_type, generation, tab_order) VALUES (@title, @page_id, @tab_type, @generation, @tab_order)",
  );

  const highestOrderTab = db
    .prepare(
      "SELECT * FROM tabs WHERE tab_order = (SELECT MAX(tab_order) FROM tabs WHERE page_id = ?)",
    )
    .get(page_id);

  const tabData = {
    title,
    page_id,
    tab_type,
    tab_order: highestOrderTab ? highestOrderTab.tab_order + 1 : 0,
    generation: 0,
  };

  if (tab_type === "text") {
    tabData.text_content = JSON.stringify([
      { type: "paragraph", children: [{ text: "" }] },
    ]);
    addTextTabQuery.run(tabData);
  }

  if (tab_type === "kanban") {
    const tab_info = addKanbanTabQuery.run(tabData);
    const current_tab_id = tab_info.lastInsertRowid;

    const highestOrderCategory = db
      .prepare(
        "SELECT * FROM kanban_categories WHERE category_order = (SELECT MAX(category_order) FROM kanban_categories WHERE tab_id = ?)",
      )
      .get(current_tab_id);

    db.prepare(
      "INSERT INTO kanban_categories (title, tab_id, category_order) VALUES (@title, @tab_id, @category_order)",
    ).run({
      title: "Kanban Column",
      tab_id: current_tab_id,
      category_order: highestOrderCategory
        ? highestOrderCategory.category_order + 1
        : 0,
    });
  }

  return res(200, { message: "Tab successfully added" });
};

export default addTab;
