import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  return NextResponse.json({
    received: true,
    event: typeof payload?.type === "string" ? payload.type : "unknown",
    note: "Persist payment status after Supabase project keys are configured."
  });
}
