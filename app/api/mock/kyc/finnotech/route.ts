import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const scenario = request.nextUrl.searchParams.get("scenario") || "approved";
  await new Promise((resolve) => setTimeout(resolve, 700));
  if (scenario === "service-error") return NextResponse.json({ message: "خطای سرویس فینوتک" }, { status: 503 });
  const outcomes: Record<string, object> = {
    approved: { status: "approved", faceScore: 96, livenessScore: 98 },
    mismatch: { status: "rejected", reason: "عدم تطابق چهره" },
    "low-quality": { status: "rejected", reason: "کیفیت نامناسب تصویر" },
    "invalid-document": { status: "rejected", reason: "مدرک نامعتبر" },
  };
  return NextResponse.json(outcomes[scenario] || outcomes.approved);
}
