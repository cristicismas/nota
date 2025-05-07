import { v4 as uuidv4 } from "uuid";
import slugify from "@/helpers/server/slugify.js";
import db from "@/helpers/server/db.js";
import res from "@/helpers/server/res";

const renamePage = async (req, params) => {
  const body = await req.json();
  const page_id = (await params).page;

  if (!page_id) {
    return res(400, { message: "No page_id given in the parameters" });
  }

  if (!body) {
    return res(400, { message: "No body present in the request" });
  }

  const { pageTitle } = body;

  if (!pageTitle) {
    return res(400, { message: "No pageTitle present in the request body" });
  }

  if (pageTitle.trim() === "") {
    return res(400, { message: "The pageTitle cannot be an empty string" });
  }

  const pageToChange = db
    .prepare("SELECT page_id, page_title, slug FROM pages WHERE page_id = ?")
    .get(page_id);

  if (pageToChange.page_title === pageTitle) {
    return res(200, {
      message: "No change",
      data: JSON.stringify({ newSlug: pageToChange.slug }),
    });
  }

  let newSlug = slugify(pageTitle);

  const pageWithSameSlug = db
    .prepare("SELECT page_id FROM pages WHERE slug = ?")
    .get(newSlug);

  if (pageWithSameSlug) {
    newSlug = uuidv4();
  }

  db.prepare("UPDATE pages SET page_title = ?, slug = ? WHERE page_id = ?").run(
    pageTitle,
    newSlug,
    page_id,
  );

  return res(200, {
    message: "Successfully renamed page",
    data: JSON.stringify({ newSlug }),
  });
};

export default renamePage;
