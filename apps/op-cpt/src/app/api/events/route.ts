import { NextResponse } from "next/server";
import { events } from "@/lib/seed-data";

export async function GET() {
  return NextResponse.json({ events });
}
