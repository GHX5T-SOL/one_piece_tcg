import products from "@/data/products.json";
import manifest from "@/data/catalogue-manifest.json";

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  universe: "One Piece" | "Pokemon" | "Yu-Gi-Oh" | "Services";
  category: string;
  productType: "Graded" | "Sealed" | "Service" | "Premium Single" | "Single";
  setName: string;
  rarity: string;
  condition: string;
  grade: string;
  priceZar: number;
  stock: number;
  status: string;
  featured: boolean;
  askOnly: boolean;
  visualKind: "slab" | "sealed" | "pokemon-pack" | "service" | "card";
  publicDescription: string;
  searchText: string;
};

export const catalogueManifest = manifest as {
  generatedAt: string;
  sourceRows: number;
  publicProducts: number;
  serviceProductsAdded: number;
  categoryCounts: Record<string, number>;
  publicSafetyPolicy: string;
};

export const allProducts = products as Product[];

export const saleProducts = allProducts.filter((product) => product.productType !== "Service");

export const featuredProducts = allProducts
  .filter((product) => product.featured && product.stock > 0)
  .slice(0, 18);

export const grailProducts = allProducts
  .filter((product) => product.priceZar >= 2500 && product.stock > 0)
  .slice(0, 12);

export const serviceProducts = allProducts.filter((product) => product.productType === "Service");

export function formatZar(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(value);
}

export function findProductBySlug(slug: string) {
  return allProducts.find((product) => product.slug === slug);
}

export function productStats() {
  const totalValue = allProducts.reduce((sum, product) => sum + product.priceZar * Math.max(product.stock, 0), 0);
  const inStock = allProducts.filter((product) => product.stock > 0).length;
  const categories = new Set(allProducts.map((product) => product.category)).size;

  return {
    products: allProducts.length,
    sourceRows: catalogueManifest.sourceRows,
    inStock,
    categories,
    totalValue
  };
}

export const productTabs = ["All", "One Piece", "Pokemon", "Graded", "Sealed", "Services"] as const;

export type ProductTab = (typeof productTabs)[number];

export function filterProducts(tab: ProductTab, query = "") {
  const needle = query.trim().toLowerCase();
  return allProducts.filter((product) => {
    const tabMatch =
      tab === "All" ||
      product.universe === tab ||
      product.productType === tab ||
      product.category.toLowerCase().includes(tab.toLowerCase());
    const queryMatch = !needle || product.searchText.includes(needle);
    return tabMatch && queryMatch;
  });
}
