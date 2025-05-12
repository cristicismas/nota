import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const getTabSlug = async (params) => {
  const { tab_id } = await params;

  if (!tab_id) {
    return res(400, { message: "tab_id is not present in the request." });
  }

  const tab = db
    .prepare("SELECT page_id, tab_order FROM tabs WHERE tab_id = ?")
    .get(tab_id);

  if (!tab?.page_id) {
    return res(400, { message: "Cannot find page_id for given tab_id" });
  }

  const page_slug = db
    .prepare("SELECT slug FROM pages WHERE page_id = ?")
    .get(tab?.page_id)?.slug;

  return res(200, { slug: page_slug, tab_order: tab?.tab_order });
};

export async function GET(_req, { params }) {
  return await getTabSlug(params);
}
