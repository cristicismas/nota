import deleteTab from "./deleteTab";
import editTabContent from "./editTabContent";
import getKanbanContent from "./getKanbanContent";

export async function GET(_req, { params }) {
  return await getKanbanContent(params);
}

export async function DELETE(_req, { params }) {
  return await deleteTab(params);
}

export async function PUT(req, { params }) {
  return await editTabContent(req, params);
}
