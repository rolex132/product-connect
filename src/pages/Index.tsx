import { Package2 } from "lucide-react";
import { PurchaseItemForm } from "@/components/PurchaseItemForm";
import { PurchaseItemTable } from "@/components/PurchaseItemTable";
import { useInventoryStore } from "@/hooks/useInventoryStore";

const Index = () => {
  const {
    purchaseItems,
    searchProducts,
    findSimilarProduct,
    createProduct,
    addPurchaseItem,
    updatePurchaseItem,
    deletePurchaseItem,
  } = useInventoryStore();

  const totalValue = purchaseItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Package2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Inventory App</h1>
            <p className="text-xs text-muted-foreground">Purchase Item Management</p>
          </div>
          <div className="ml-auto flex gap-6 text-sm">
            <div className="text-right">
              <p className="text-muted-foreground">Total Items</p>
              <p className="font-semibold text-foreground">{purchaseItems.length}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Total Value</p>
              <p className="font-semibold text-foreground">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        <PurchaseItemForm
          searchProducts={searchProducts}
          findSimilarProduct={findSimilarProduct}
          createProduct={createProduct}
          addPurchaseItem={addPurchaseItem}
        />
        <PurchaseItemTable
          items={purchaseItems}
          searchProducts={searchProducts}
          findSimilarProduct={findSimilarProduct}
          createProduct={createProduct}
          updatePurchaseItem={updatePurchaseItem}
          deletePurchaseItem={deletePurchaseItem}
        />
      </main>
    </div>
  );
};

export default Index;
