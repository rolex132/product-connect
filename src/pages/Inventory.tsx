import { useState } from "react";
import { Link } from "react-router-dom";
import { Package2, Plus, PlusCircle, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useInventoryStore } from "@/hooks/useInventoryStore";
import type { Product } from "@/types/inventory";

const CATEGORIES = ["Electronics", "Furniture", "Accessories", "Office Supplies", "Other"];

const Inventory = () => {
  const { products, createProduct, updateProductQuantity, searchProducts } = useInventoryStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Package2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Inventory</h1>
            <p className="text-xs text-muted-foreground">Product Stock Management</p>
          </div>
          <div className="ml-auto flex gap-6 text-sm">
            <div className="text-right">
              <p className="text-muted-foreground">Total Products</p>
              <p className="font-semibold text-foreground">{products.length}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Total Stock</p>
              <p className="font-semibold text-foreground">{totalStock}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Total Value</p>
              <p className="font-semibold text-foreground">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        <div className="flex gap-2">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Checkout
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package2 className="h-5 w-5 text-primary" />
                Products ({products.length})
              </CardTitle>
              <Button onClick={() => setShowAddForm(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          {product.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <span className={`font-semibold ${product.quantity === 0 ? "text-destructive" : product.quantity < 5 ? "text-warning" : "text-foreground"}`}>
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
          </CardContent>
        </Card>
      </main>

      {/* Add Product Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Unit Price ($)</Label>
                <Input type="number" min="0" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="0" step="1" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} placeholder="0" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit">Add Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Quantity Dialog */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Quantity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">{editProduct?.name}</p>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" min="0" step="1" value={editQty} onChange={(e) => setEditQty(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;