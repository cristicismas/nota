import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const getSearchValues = async () => {
  const pages = db
    .prepare("SELECT slug, page_title FROM pages")
    .all()
    .map((page) => ({ type: "page", text: page.page_title, slug: page.slug }));

  const tabs = db
    .prepare("SELECT tab_id, title FROM tabs")
    .all()
    .map((tab) => ({ type: "tab", text: tab.title, tab_id: tab.tab_id }));

  return res(200, [...pages, ...tabs]);
};

export async function GET() {
  return await getSearchValues();
}
