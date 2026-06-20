"use client";

import { useMemo, useSyncExternalStore } from "react";
import { allProducts, type Product } from "@/lib/products";

export type CartLine = {
  productId: string;
  quantity: number;
};

const STORAGE_KEY = "vault-room-cart-v1";

function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  window.dispatchEvent(new CustomEvent("vault-room-cart"));
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", callback);
  window.addEventListener("vault-room-cart", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("vault-room-cart", callback);
  };
}

function getSnapshot() {
  return JSON.stringify(readCart());
}

function getServerSnapshot() {
  return "[]";
}

export function useCart() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const lines = useMemo(() => JSON.parse(snapshot) as CartLine[], [snapshot]);

  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const product = allProducts.find((candidate) => candidate.id === line.productId);
          return product ? { product, quantity: line.quantity } : null;
        })
        .filter((item): item is { product: Product; quantity: number } => Boolean(item)),
    [lines]
  );

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.priceZar * item.quantity, 0);

  function setQuantity(product: Product, quantity: number) {
    const safeQuantity = Math.max(0, Math.min(quantity, Math.max(product.stock, 1)));
    const next = readCart().filter((line) => line.productId !== product.id);
    if (safeQuantity > 0) next.push({ productId: product.id, quantity: safeQuantity });
    writeCart(next);
  }

  function add(product: Product, quantity = 1) {
    const current = readCart().find((line) => line.productId === product.id)?.quantity || 0;
    setQuantity(product, current + quantity);
  }

  function remove(product: Product) {
    setQuantity(product, 0);
  }

  function clear() {
    writeCart([]);
  }

  return { lines, items, count, subtotal, add, remove, setQuantity, clear };
}
