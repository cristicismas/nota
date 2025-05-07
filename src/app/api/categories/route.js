import addCategory from "./addCategory";
import updateCategories from "./updateCategories";

export async function POST(req) {
  return await addCategory(req);
}

export async function PUT(req) {
  return await updateCategories(req);
}
