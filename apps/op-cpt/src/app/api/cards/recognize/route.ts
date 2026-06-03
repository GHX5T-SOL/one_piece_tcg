import { NextResponse } from "next/server";
import { z } from "zod";
import { searchCards } from "@/lib/search";

const recognizeSchema = z.object({
  textHint: z.string().optional(),
  imageUrl: z.string().url().optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = recognizeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid recognition request", issues: parsed.error.issues }, { status: 400 });
  }

  const textHint = parsed.data.textHint || "";
  const candidates = searchCards(textHint).slice(0, 5);

  return NextResponse.json({
    mode: "manual-assisted",
    message: "Camera/card recognition is planned for v1.1. MVP returns text-hint candidates for human verification.",
    imageReceived: Boolean(parsed.data.imageUrl),
    candidates
  });
}
