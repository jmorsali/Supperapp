import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { nationalId, mobile } = await request.json();
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (nationalId === "9999999999") return NextResponse.json({ message: "سرویس در دسترس نیست" }, { status: 503 });
  if (nationalId === "1111111111") return NextResponse.json({ matched: false, fallback: "civil-registry" });
  if (!nationalId || !mobile) return NextResponse.json({ message: "اطلاعات ناقص است" }, { status: 400 });
  return NextResponse.json({ matched: true, mobileMatched: true, over18: true, profile: { fullName: "علی محمدی", birthDate: "1371/02/25", nationalId } });
}
