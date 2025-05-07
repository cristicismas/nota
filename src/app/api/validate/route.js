import setSessionCookie from "@/helpers/server/setSessionCookie";
import validateSession from "@/helpers/server/validateSession";
import res from "@/helpers/server/res";

export async function POST(req) {
  const isValidSession = validateSession(req);

  if (!isValidSession) {
    setSessionCookie(res, "");

    return res(401, { message: "Session id is invalid" });
  }

  return res(200, { message: "Session is valid" });
}
