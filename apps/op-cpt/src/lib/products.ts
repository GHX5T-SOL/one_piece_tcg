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

export const featuredProductIds = [
  "TVR-CAT-0010",
  "TVR-CAT-0011",
  "TVR-CAT-0007",
  "TVR-CAT-0017",
  "TVR-CAT-0022",
  "TVR-CAT-0026",
  "TVR-CAT-0030"
] as const;

const featuredProductIdSet = new Set<string>(featuredProductIds);

export const productImages: Record<string, { src: string; width: number; height: number }> = {
  "TVR-CAT-0010": { src: "/products/featured/roronoa-zoro-25th-cgc10.jpg", width: 952, height: 1620 },
  "TVR-CAT-0011": { src: "/products/featured/koby-prb02-cgc10.jpg", width: 1000, height: 1717 },
  "TVR-CAT-0007": { src: "/products/featured/borsalino-op06-psa10.jpg", width: 1000, height: 1664 },
  "TVR-CAT-0017": { src: "/products/featured/doflamingo-prb02-psa10.jpg", width: 1000, height: 1677 },
  "TVR-CAT-0022": { src: "/products/featured/cavendish-op10-psa10.jpg", width: 1000, height: 1667 },
  "TVR-CAT-0026": { src: "/products/featured/i-know-youre-strong-3rd-anniversary-psa10.jpg", width: 1000, height: 1676 },
  "TVR-CAT-0030": { src: "/products/featured/koala-op12-psa10.jpg", width: 1000, height: 1672 }
};

export const featuredProducts = [
  ...featuredProductIds.map((id) => allProducts.find((product) => product.id === id)).filter((product): product is Product => Boolean(product)),
  ...allProducts.filter((product) => product.featured && product.stock > 0 && !featuredProductIdSet.has(product.id))
].slice(0, 18);

export function isFeaturedProduct(productId: string) {
  return featuredProductIdSet.has(productId);
}

export function getProductImage(productId: string) {
  return productImages[productId];
}

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
