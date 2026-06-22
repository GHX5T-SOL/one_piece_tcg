import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { allProducts } from "@/lib/products";

const checkoutSchema = z.object({
  lines: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().max(99)
      })
    )
    .min(1)
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid cart." }, { status: 400 });
  }

  const cartLines = parsed.data.lines.map((line) => {
    const product = allProducts.find((candidate) => candidate.id === line.productId);
    if (!product) return null;
    return {
      product,
      quantity: Math.min(line.quantity, Math.max(product.stock, 1))
    };
  });

  if (cartLines.some((line) => line === null)) {
    return NextResponse.json({ message: "One or more catalogue items could not be found." }, { status: 404 });
  }

  const validLines = cartLines as NonNullable<(typeof cartLines)[number]>[];
  const amount = validLines.reduce((sum, line) => sum + line.product.priceZar * line.quantity, 0);

  if (amount <= 0) {
    return NextResponse.json({ message: "Cart total must be greater than zero." }, { status: 400 });
  }

  const orderId = `tvr-${Date.now()}-${randomUUID().slice(0, 8)}`;

  return NextResponse.json({
    mode: "invoice",
    orderId,
    amount,
    message:
      "Online payments are coming soon. Generate an invoice with shipping excluded, then message admin on WhatsApp so we can confirm availability and send the payment link."
  });
}
