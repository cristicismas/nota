const THREE_MONTHS = 7889400000;

const setSessionCookie = (res, value) => {
  res.cookies.set("sessionId", value, {
    maxAge: THREE_MONTHS,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res;
};

export default setSessionCookie;
