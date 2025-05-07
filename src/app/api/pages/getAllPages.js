import db from "@/helpers/server/db";
import res from "@/helpers/server/res";

const getAllPages = (req) => {
  const sessionId = req.cookies.get("sessionId")?.value;

  const userSession = db
    .prepare("SELECT user_id FROM sessions WHERE session_uuid = ?")
    .get(sessionId);

  const pages =
    db
      .prepare("SELECT * FROM pages WHERE user_id = ?")
      .all(userSession.user_id) || [];

  return res(200, [...pages]);
};

export default getAllPages;
