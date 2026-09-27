import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!/^09\d{9}$/.test(body.mobile || "")) return NextResponse.json({ message: "شماره موبایل معتبر نیست" }, { status: 400 });
  await new Promise((resolve) => setTimeout(resolve, 250));
  return NextResponse.json({ requestId: `otp-${Date.now()}`, expiresIn: 120, mockCode: "12345" });
}
