import { useState, useCallback, useEffect } from "react";
import type { Product, PurchaseItem } from "@/types/inventory";

const PRODUCTS_KEY = "inventory_products";
const ITEMS_KEY = "inventory_purchase_items";

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

const generateId = () => crypto.randomUUID();

// Seed data
const SEED_PRODUCTS: Product[] = [
  { id: generateId(), name: "Laptop Dell Inspiron 15", sku: "DELL-INS-15", category: "Electronics", price: 749.99, quantity: 10, created_at: new Date().toISOString() },
  { id: generateId(), name: "Office Chair Ergonomic", sku: "CHAIR-ERG-01", category: "Furniture", price: 299.99, quantity: 5, created_at: new Date().toISOString() },
  { id: generateId(), name: "Wireless Mouse Logitech", sku: "LOG-MX-M", category: "Accessories", price: 49.99, quantity: 25, created_at: new Date().toISOString() },
  { id: generateId(), name: "USB-C Hub 7-in-1", sku: "USB-HUB-7", category: "Accessories", price: 39.99, quantity: 30, created_at: new Date().toISOString() },
  { id: generateId(), name: "Monitor 27\" 4K", sku: "MON-27-4K", category: "Electronics", price: 449.99, quantity: 8, created_at: new Date().toISOString() },
  { id: generateId(), name: "Mechanical Keyboard", sku: "KB-MECH-01", category: "Accessories", price: 129.99, quantity: 15, created_at: new Date().toISOString() },
  { id: generateId(), name: "Standing Desk Frame", sku: "DESK-STD-01", category: "Furniture", price: 399.99, quantity: 3, created_at: new Date().toISOString() },
  { id: generateId(), name: "Webcam HD 1080p", sku: "CAM-HD-1080", category: "Electronics", price: 79.99, quantity: 12, created_at: new Date().toISOString() },
];

export function useInventoryStore() {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = loadFromStorage<Product>(PRODUCTS_KEY, []);
    if (stored.length === 0) {
      saveToStorage(PRODUCTS_KEY, SEED_PRODUCTS);
      return SEED_PRODUCTS;
    }
    return stored;
  });

  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>(() =>
    loadFromStorage<PurchaseItem>(ITEMS_KEY, [])
  );

  useEffect(() => saveToStorage(PRODUCTS_KEY, products), [products]);
  useEffect(() => saveToStorage(ITEMS_KEY, purchaseItems), [purchaseItems]);

  const searchProducts = useCallback(
    (query: string): Product[] => {
      if (!query.trim()) return [];
      const q = query.toLowerCase();
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    },
    [products]
  );

  const findSimilarProduct = useCallback(
    (name: string): Product | undefined => {
      const q = name.toLowerCase().trim();
      return products.find(
        (p) => p.name.toLowerCase() === q || p.name.toLowerCase().includes(q)
      );
    },
    [products]
  );

  const createProduct = useCallback((data: Omit<Product, "id" | "created_at">): Product => {
    const product: Product = { ...data, id: generateId(), created_at: new Date().toISOString() };
    setProducts((prev) => [...prev, product]);
    return product;
  }, []);

  const updateProductQuantity = useCallback((id: string, quantity: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)));
  }, []);

  const addPurchaseItem = useCallback((data: Omit<PurchaseItem, "id" | "created_at">) => {
    const item: PurchaseItem = { ...data, id: generateId(), created_at: new Date().toISOString() };
    setPurchaseItems((prev) => [item, ...prev]);
  }, []);

  const updatePurchaseItem = useCallback((id: string, data: Partial<PurchaseItem>) => {
    setPurchaseItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
  }, []);

  const deletePurchaseItem = useCallback((id: string) => {
    setPurchaseItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearPurchaseItems = useCallback(() => {
    setPurchaseItems([]);
  }, []);

  return {
    products,
    purchaseItems,
    searchProducts,
    findSimilarProduct,
    createProduct,
    addPurchaseItem,
    updatePurchaseItem,
    deletePurchaseItem,
    updateProductQuantity,
    clearPurchaseItems,
  };
}
