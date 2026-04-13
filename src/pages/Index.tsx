import { useState } from "react";
import { Link } from "react-router-dom";
import { Package2, Boxes, ShoppingCart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PurchaseItemForm } from "@/components/PurchaseItemForm";
import { PurchaseItemTable } from "@/components/PurchaseItemTable";
import { useInventoryStore } from "@/hooks/useInventoryStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const Index = () => {
  const {
    purchaseItems,
    searchProducts,
    findSimilarProduct,
    createProduct,
    addPurchaseItem,
    updatePurchaseItem,
    deletePurchaseItem,
    clearPurchaseItems,
  } = useInventoryStore();

  const [showCheckout, setShowCheckout] = useState(false);

  const totalValue = purchaseItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleCheckout = () => {
    clearPurchaseItems();
    setShowCheckout(false);
    toast.success("Checkout complete! All items processed.");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Package2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Checkout</h1>
            <p className="text-xs text-muted-foreground">Purchase Item Management</p>
          </div>
          <Link to="/inventory" className="ml-auto">
            <Button variant="outline" size="sm">
              <Boxes className="h-4 w-4 mr-2" />
              Inventory
            </Button>
          </Link>
          {purchaseItems.length > 0 && (
            <Button size="sm" onClick={() => setShowCheckout(true)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Checkout ({purchaseItems.length})
            </Button>
          )}
          <div className="flex gap-6 text-sm">
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

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Complete Checkout
            </DialogTitle>
            <DialogDescription>
              You have {purchaseItems.length} item(s) with total value of ${totalValue.toFixed(2)}.
              This will process all items and clear the cart.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2">Item</th>
                    <th className="text-right p-2">Qty</th>
                    <th className="text-right p-2">Price</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseItems.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">{item.item_name}</td>
                      <td className="text-right p-2">{item.quantity}</td>
                      <td className="text-right p-2">${item.price.toFixed(2)}</td>
                      <td className="text-right p-2 font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t bg-muted/30">
                  <tr>
                    <td colSpan={3} className="text-right p-2 font-semibold">Total</td>
                    <td className="text-right p-2 font-semibold">${totalValue.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckout(false)}>Cancel</Button>
            <Button onClick={handleCheckout}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
