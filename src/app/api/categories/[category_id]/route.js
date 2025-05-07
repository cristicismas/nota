import updateCategory from "./updateCategory";
import deleteCategory from "./deleteCategory";

export async function PUT(req, { params }) {
  return await updateCategory(req, params);
}

export async function DELETE(_req, { params }) {
  return await deleteCategory(params);
}
