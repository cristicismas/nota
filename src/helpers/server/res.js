import { NextResponse } from "next/server";

const res = (status = 200, body = {}) => {
  return NextResponse.json(body, { status });
};

export default res;
