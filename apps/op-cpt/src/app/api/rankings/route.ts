import { NextResponse } from "next/server";
import { rankings } from "@/lib/seed-data";

export async function GET() {
  return NextResponse.json({
    season: "member-beta",
    rankings
  });
}
