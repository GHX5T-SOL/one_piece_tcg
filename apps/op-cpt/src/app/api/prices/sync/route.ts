import { NextResponse } from "next/server";
import { getPriceSyncPlan } from "@/lib/market";

export async function GET() {
  return NextResponse.json(getPriceSyncPlan());
}

export async function POST() {
  return NextResponse.json(getPriceSyncPlan());
}
