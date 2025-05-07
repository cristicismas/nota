import getPage from "./getPage";
import deletePage from "./deletePage";
import renamePage from "./renamePage";

export async function GET(_req, { params }) {
  return await getPage(params);
}

export async function DELETE(_req, { params }) {
  return await deletePage(params);
}

export async function PUT(req, { params }) {
  return await renamePage(req, params);
}
