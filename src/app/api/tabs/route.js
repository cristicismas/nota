import addTab from "./addTab";

export async function POST(req) {
  return await addTab(req);
}
