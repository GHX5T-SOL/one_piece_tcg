import { NextResponse } from "next/server";
import { searchCards } from "@/lib/search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  return NextResponse.json({
    query,
    count: searchCards(query).length,
    cards: searchCards(query)
  });
}
