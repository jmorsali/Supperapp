import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ name: "Hummers mock backend", status: "ok", persistence: "IndexedDB", currency: "TOMAN" });
}
