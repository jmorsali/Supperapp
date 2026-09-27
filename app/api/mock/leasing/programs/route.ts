import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: "p-1", title: "خرید آسان هامرز", financeProvider: "لیزینگ هامرز", minAmountToman: 20_000_000, maxAmountToman: 150_000_000, durations: [6, 12], profitRate: 18, maxLoanPricePercentage: 70, isAvailableInHummersApp: true },
    { id: "p-2", title: "اعتبار ویژه کالا", financeProvider: "لیزینگ هامرز", minAmountToman: 50_000_000, maxAmountToman: 300_000_000, durations: [12, 18, 24], profitRate: 21, maxLoanPricePercentage: 70, isAvailableInHummersApp: true },
  ]);
}
