export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  created_at: string;
}

export interface PurchaseItem {
  id: string;
  product_id: string | null;
  item_name: string;
  quantity: number;
  price: number;
  created_at: string;
}
