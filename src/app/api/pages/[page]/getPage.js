import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const getPage = async (params) => {
  const page_slug = (await params).page;

  const page = db.prepare("SELECT * FROM pages WHERE slug = ?").get(page_slug);

  if (!page) {
    return res(404, { message: "Page not found" });
  }

  const tabs = db
    .prepare("SELECT * FROM tabs WHERE page_id = ? ORDER BY tab_order ASC")
    .all(page.page_id);

  const pageData = { ...page, tabs };

  return res(200, pageData);
};

export default getPage;
