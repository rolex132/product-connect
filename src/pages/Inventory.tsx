import { useState } from "react";
import { Link } from "react-router-dom";
import { Package2, Plus, PlusCircle, ArrowLeft, Pencil, Menu, TrendingUp, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useInventoryStore } from "@/hooks/useInventoryStore";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import type { Product } from "@/types/inventory";

const CATEGORIES = ["Electronics", "Furniture", "Accessories", "Office Supplies", "Other"];

const Inventory = () => {
  const { products, createProduct, updateProductQuantity, searchProducts } = useInventoryStore();
  const isMobile = useIsMobile();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSku, setNewSku] = useState("");
  const [newCategory, setNewCategory] = useState("Other");
  const [newPrice, setNewPrice] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editQty, setEditQty] = useState("");
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) { toast.error("Product name is required"); return; }
    if (!newSku.trim()) { toast.error("SKU is required"); return; }
    if (!newPrice || Number(newPrice) < 0) { toast.error("Valid price is required"); return; }
    if (!newQuantity || Number(newQuantity) < 0) { toast.error("Valid quantity is required"); return; }

    createProduct({
      name: newName.trim(),
      sku: newSku.trim(),
      category: newCategory,
      price: Number(newPrice),
      quantity: Number(newQuantity),
    });
    toast.success("Product added to inventory");
    setShowAddForm(false);
    setNewName(""); setNewSku(""); setNewCategory("Other"); setNewPrice(""); setNewQuantity("");
  };

  const handleEditSave = () => {
    if (!editProduct) return;
    if (!editQty || Number(editQty) < 0) { toast.error("Valid quantity required"); return; }
    updateProductQuantity(editProduct.id, Number(editQty));
    toast.success("Quantity updated");
    setEditProduct(null);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setEditQty(product.quantity.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                <Package2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground">Inventory</h1>
                <p className="text-xs text-muted-foreground">Product Stock</p>
              </div>
            </div>

            {isMobile ? (
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setShowAddForm(true)}
                  className="bg-primary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 mr-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Products</p>
                    <p className="font-bold text-lg text-foreground">{products.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className="font-bold text-lg text-foreground">{totalStock}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Value</p>
                    <p className="font-bold text-lg text-primary">${totalValue.toFixed(2)}</p>
                  </div>
                </div>
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Checkout
                  </Button>
                </Link>
                <Button onClick={() => setShowAddForm(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-[280px] sm:w-[320px]">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Navigate and stats</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Products</p>
                <p className="font-bold text-lg">{products.length}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Stock</p>
                <p className="font-bold text-lg">{totalStock}</p>
              </Card>
              <Card className="p-3 col-span-2">
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="font-bold text-lg text-primary">${totalValue.toFixed(2)}</p>
              </Card>
            </div>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-start">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Checkout
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {isMobile && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <Archive className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Products</p>
              <p className="font-bold text-lg">{products.length}</p>
            </Card>
            <Card className="p-3 text-center">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Stock</p>
              <p className="font-bold text-lg">{totalStock}</p>
            </Card>
            <Card className="p-3 text-center">
              <Package2 className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Value</p>
              <p className="font-bold text-lg text-primary">${totalValue.toFixed(2)}</p>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package2 className="h-5 w-5 text-primary" />
                <span className="hidden sm:inline">Products</span>
                <Badge variant="secondary" className="ml-1">{products.length}</Badge>
              </CardTitle>
              {isMobile && (
                <Button onClick={() => setShowAddForm(true)} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground">No products yet. Add your first product!</p>
              </div>
            ) : isMobile ? (
              <div className="space-y-3">
                {products.map((product) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-semibold">${product.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Qty</p>
                        <p className={`font-semibold ${product.quantity === 0 ? "text-destructive" : product.quantity < 5 ? "text-orange-500" : ""}`}>
                          {product.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-semibold">${(product.price * product.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Product Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="group">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${product.quantity === 0 ? "text-destructive" : product.quantity < 5 ? "text-orange-500" : "text-foreground"}`}>
                            {product.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${(product.price * product.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className={isMobile ? "max-w-[calc(100%-16px)]" : ""}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              Add New Product
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter product name" />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input value={newSku} onChange={(e) => setNewSku(e.target.value)} placeholder="e.g., PROD-001" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={isMobile ? "space-y-4" : "grid grid-cols-2 gap-4"}>
              <div className="space-y-2">
                <Label>Unit Price ($)</Label>
                <Input type="number" min="0" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="0" step="1" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} placeholder="0" />
              </div>
            </div>
            <DialogFooter className={isMobile ? "flex-col-reverse gap-2 sm:flex-row" : ""}>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit">Add Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent className={isMobile ? "max-w-[calc(100%-16px)]" : ""}>
          <DialogHeader>
            <DialogTitle>Update Quantity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-medium">{editProduct?.name}</p>
              <p className="text-sm text-muted-foreground">{editProduct?.sku}</p>
            </div>
            <div className="space-y-2">
              <Label>New Quantity</Label>
              <Input type="number" min="0" step="1" value={editQty} onChange={(e) => setEditQty(e.target.value)} />
            </div>
          </div>
          <DialogFooter className={isMobile ? "flex-col-reverse gap-2 sm:flex-row" : ""}>
            <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;