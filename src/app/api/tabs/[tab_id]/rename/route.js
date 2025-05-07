import renameTab from "./renameTab";

export async function PUT(req, { params }) {
  return await renameTab(req, params);
}
