import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { amount, scenario = "success" } = await request.json();
  if (!amount || amount < 1_000_000) return NextResponse.json({ message: "مبلغ کمتر از حداقل مجاز است" }, { status: 400 });
  const status = scenario === "timeout" ? 504 : 200;
  return NextResponse.json({ transactionId: `TX-${Date.now()}`, status: scenario }, { status });
}
