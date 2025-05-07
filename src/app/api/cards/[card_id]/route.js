import deleteCard from "./deleteCard";
import editCard from "./editCard";

export async function PUT(req, { params }) {
  return await editCard(req, params);
}

export async function DELETE(_req, { params }) {
  return await deleteCard(params);
}
