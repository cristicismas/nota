import addCard from "./addCard";
import reorderCards from "./reorderCards";

export async function POST(req) {
  return await addCard(req);
}

export async function PUT(req) {
  return await reorderCards(req);
}
