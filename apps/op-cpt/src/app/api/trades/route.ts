import { NextResponse } from "next/server";
import { z } from "zod";
import { trades } from "@/lib/seed-data";

const tradeSchema = z.object({
  fromHandle: z.string().min(3),
  seeking: z.string().min(3),
  offering: z.string().min(3),
  notes: z.string().max(1000).optional()
});

export async function GET() {
  return NextResponse.json({ trades });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = tradeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid trade offer", issues: parsed.error.issues }, { status: 400 });
  }

  return NextResponse.json(
    {
      mode: "seeded-preview",
      message: "Trade offer accepted for preview only. Supabase persistence is enabled after credentials and RLS migration are applied.",
      trade: {
        id: `preview-${Date.now()}`,
        status: "review",
        expiresIn: "7 days",
        ...parsed.data
      }
    },
    { status: 201 }
  );
}
