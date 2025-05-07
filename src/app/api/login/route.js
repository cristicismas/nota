import db from "@/helpers/server/db";
import res from "@/helpers/server/res";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import setSessionCookie from "@/helpers/server/setSessionCookie";

export async function POST(req) {
  const body = await req.json();

  if (!body) return res(400, { message: "No body present in the request" });

  const { username, password } = body;

  if (!username || !password) {
    return res(400, {
      message: "No username or password present in the request",
    });
  }

  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);

  if (!user) {
    return res(401, { message: "Unauthorized" });
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    return res(401, { message: "Unauthorized" });
  }

  const sessionId = uuidv4();

  db.prepare("INSERT INTO sessions (user_id, session_uuid) values (?, ?)").run(
    user.id,
    sessionId,
  );

  return setSessionCookie(res(200, { sessionId }), sessionId);
}
