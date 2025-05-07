import db from "./db.js";

const THREE_MONTHS = 7889400000;

// Returns true if the session is still valid, false otherwise
const validateSession = (req) => {
  const sessionId = req.cookies.get("sessionId")?.value;

  if (!sessionId) {
    return false;
  }

  const foundSession = db
    .prepare("SELECT * FROM sessions WHERE session_uuid = ?")
    .get(sessionId);

  if (!foundSession) {
    return false;
  }

  const createdAt = new Date(foundSession.created_at);
  const now = new Date();
  const dateDifference = Math.abs(createdAt - now);

  if (dateDifference > THREE_MONTHS) {
    return false;
  }

  return true;
};

export default validateSession;
