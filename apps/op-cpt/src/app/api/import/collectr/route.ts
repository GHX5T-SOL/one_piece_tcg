import { NextResponse } from "next/server";
import { z } from "zod";
import { cards } from "@/lib/seed-data";

const importSchema = z.object({
  collectrProfileUrl: z.string().url(),
  dryRun: z.boolean().default(true)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = importSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid Collectr import request", issues: parsed.error.issues }, { status: 400 });
  }

  return NextResponse.json({
    mode: "dry-run",
    profile: parsed.data.collectrProfileUrl,
    importedCount: cards.length,
    dryRun: parsed.data.dryRun,
    message: "Collectr import is seeded from the verified profile snapshot. Live Collectr scraping/import requires a separate authenticated refresh pass.",
    cards
  });
}
