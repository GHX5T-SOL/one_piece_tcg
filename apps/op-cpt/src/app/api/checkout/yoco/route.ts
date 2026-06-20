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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const orderId = `tvr-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const secretKey = process.env.YOCO_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({
      mode: "claim",
      orderId,
      message: "Checkout is in claim mode until Yoco keys are configured. Message us and we will lock this cart manually."
    });
  }

  const response = await fetch("https://payments.yoco.com/api/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": orderId
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency: "ZAR",
      successUrl: `${siteUrl}/checkout/success?order=${encodeURIComponent(orderId)}`,
      cancelUrl: `${siteUrl}/checkout/cancel?order=${encodeURIComponent(orderId)}`,
      metadata: {
        orderId,
        channel: "the-vault-room-web",
        items: validLines.map((line) => ({
          sku: line.product.sku,
          quantity: line.quantity
        }))
      }
    })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    return NextResponse.json(
      {
        message: "Yoco checkout could not be created. Use WhatsApp claim mode while we verify the payment setup.",
        detail: payload?.message || payload?.detail || "checkout_failed"
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    orderId,
    redirectUrl: payload.redirectUrl,
    checkoutId: payload.id
  });
}
