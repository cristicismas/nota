import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const getSearchValues = async () => {
  const pages = db
    .prepare("SELECT slug, page_title FROM pages")
    .all()
    .map((page) => ({ type: "page", text: page.page_title, slug: page.slug }));

  const tabs = db
    .prepare("SELECT tab_id, page_id, title FROM tabs")
    .all()
    .map((tab) => ({
      type: "tab",
      text: tab.title,
      tab_id: tab.tab_id,
      page_id: tab.page_id,
    }))
    .map((tab) => {
      const page_title = db
        .prepare("SELECT page_title FROM pages WHERE page_id = ?")
        .get(tab?.page_id)?.page_title;

      return { ...tab, page_title };
    });

  return res(200, [...pages, ...tabs]);
};

export async function GET() {
  return await getSearchValues();
}
