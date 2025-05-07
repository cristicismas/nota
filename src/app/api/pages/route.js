import getAllPages from "./getAllPages";
import addPage from "./addPage";

export async function GET(req) {
  return getAllPages(req);
}

export async function POST(req) {
  return await addPage(req);
}
