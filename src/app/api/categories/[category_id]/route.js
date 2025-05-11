import updateCategory from "./updateCategory";
import deleteCategory from "./deleteCategory";
import getCategoryData from "./getCategoryData";

export async function GET(_req, { params }) {
  return await getCategoryData(params);
}

export async function PUT(req, { params }) {
  return await updateCategory(req, params);
}

export async function DELETE(_req, { params }) {
  return await deleteCategory(params);
}
