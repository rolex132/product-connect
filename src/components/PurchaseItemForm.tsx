import { useState } from "react";
import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductSearch } from "./ProductSearch";
import { toast } from "sonner";
import type { Product } from "@/types/inventory";

interface PurchaseItemFormProps {
  searchProducts: (query: string) => Product[];
  findSimilarProduct: (name: string) => Product | undefined;
  createProduct: (data: Omit<Product, "id" | "created_at">) => Product;
  addPurchaseItem: (data: { product_id: string | null; item_name: string; quantity: number; price: number }) => void;
}

export function PurchaseItemForm({ searchProducts, findSimilarProduct, createProduct, addPurchaseItem }: PurchaseItemFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [showSuggestion, setShowSuggestion] = useState<Product | null>(null);

  const reset = () => {
    setSelectedProduct(null);
    setItemName("");
    setQuantity("");
    setPrice("");
    setShowSuggestion(null);
  };

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setItemName(product.name);
    setPrice(product.price.toString());
    setShowSuggestion(null);
  };

  const handleManualEntry = (name: string) => {
    setSelectedProduct(null);
    setItemName(name);
    const similar = findSimilarProduct(name);
    if (similar) setShowSuggestion(similar);
    else setShowSuggestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) { toast.error("Item name is required"); return; }
    if (!quantity || Number(quantity) <= 0) { toast.error("Quantity must be greater than 0"); return; }
    if (!price || Number(price) < 0) { toast.error("Price must be valid"); return; }

    let productId = selectedProduct?.id ?? null;

    if (!productId) {
      const newProduct = createProduct({ name: itemName.trim(), sku: "", category: "Uncategorized", price: Number(price) });
      productId = newProduct.id;
    }

    addPurchaseItem({ product_id: productId, item_name: itemName.trim(), quantity: Number(quantity), price: Number(price) });
    toast.success("Purchase item added successfully");
    reset();
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PackagePlus className="h-5 w-5 text-primary" />
          Add Purchase Item
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Product Search</Label>
            <ProductSearch
              searchProducts={searchProducts}
              onSelect={handleSelect}
              onManualEntry={handleManualEntry}
              value={itemName}
            />
            {showSuggestion && (
              <div className="rounded-md bg-warning/10 border border-warning/30 p-3 animate-fade-in">
                <p className="text-sm text-foreground">
                  Similar product found: <strong>{showSuggestion.name}</strong>.{" "}
                  <button type="button" className="text-primary font-medium underline" onClick={() => handleSelect(showSuggestion)}>
                    Use this instead?
                  </button>
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Unit Price ($)</Label>
              <Input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <PackagePlus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
