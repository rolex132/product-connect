import { useState } from "react";
import { Link } from "react-router-dom";
import { Package2, Boxes, ShoppingCart, CheckCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PurchaseItemForm } from "@/components/PurchaseItemForm";
import { PurchaseItemTable } from "@/components/PurchaseItemTable";
import { useInventoryStore } from "@/hooks/useInventoryStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

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

  const isMobile = useIsMobile();
  const [showCheckout, setShowCheckout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalValue = purchaseItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const handleCheckout = () => {
    clearPurchaseItems();
    setShowCheckout(false);
    toast.success("Checkout complete! All items processed.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                <Package2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground">Checkout</h1>
                <p className="text-xs text-muted-foreground">Purchase Items</p>
              </div>
            </div>

            {isMobile ? (
              <>
                <div className="flex items-center gap-2">
                  {purchaseItems.length > 0 && (
                    <Button 
                      size="sm" 
                      onClick={() => setShowCheckout(true)}
                      className="relative"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="ml-1">{purchaseItems.length}</span>
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 mr-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Items</p>
                    <p className="font-bold text-lg text-foreground">{purchaseItems.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-bold text-lg text-primary">${totalValue.toFixed(2)}</p>
                  </div>
                </div>
                <Link to="/inventory">
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
              </div>
            )}
          </div>

          {isMobile && purchaseItems.length > 0 && (
            <div className="pb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Items</p>
                  <p className="font-bold text-foreground">{purchaseItems.length}</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-bold text-primary">${totalValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-[280px] sm:w-[320px]">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Navigate the app</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Link to="/inventory" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start">
                <Boxes className="h-4 w-4 mr-2" />
                Inventory
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

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
        <DialogContent className={isMobile ? "max-w-[calc(100%-16px)] max-h-[85vh] overflow-y-auto" : ""}>
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
          <DialogFooter className={isMobile ? "flex-col-reverse gap-2 sm:flex-row" : ""}>
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
