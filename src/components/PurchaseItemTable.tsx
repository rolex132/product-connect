import { useState } from "react";
import { Pencil, Trash2, ArrowUpDown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductSearch } from "./ProductSearch";
import { toast } from "sonner";
import type { Product, PurchaseItem } from "@/types/inventory";

interface PurchaseItemTableProps {
  items: PurchaseItem[];
  searchProducts: (query: string) => Product[];
  findSimilarProduct: (name: string) => Product | undefined;
  createProduct: (data: Omit<Product, "id" | "created_at">) => Product;
  updatePurchaseItem: (id: string, data: Partial<PurchaseItem>) => void;
  deletePurchaseItem: (id: string) => void;
}

type SortKey = "item_name" | "quantity" | "price" | "created_at";

export function PurchaseItemTable({ items, searchProducts, findSimilarProduct, createProduct, updatePurchaseItem, deletePurchaseItem }: PurchaseItemTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<PurchaseItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editQty, setEditQty] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const sorted = [...items].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === "item_name") return a.item_name.localeCompare(b.item_name) * dir;
    if (sortKey === "quantity") return (a.quantity - b.quantity) * dir;
    if (sortKey === "price") return (a.price - b.price) * dir;
    return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const openEdit = (item: PurchaseItem) => {
    setEditItem(item);
    setEditName(item.item_name);
    setEditQty(item.quantity.toString());
    setEditPrice(item.price.toString());
    setEditProductId(item.product_id);
  };

  const handleEditSave = () => {
    if (!editItem) return;
    if (!editName.trim()) { toast.error("Item name is required"); return; }
    if (!editQty || Number(editQty) <= 0) { toast.error("Quantity must be > 0"); return; }
    if (!editPrice || Number(editPrice) < 0) { toast.error("Price must be valid"); return; }

    let productId = editProductId;
    if (!productId && editName.trim()) {
      const similar = findSimilarProduct(editName);
      if (similar) {
        productId = similar.id;
      } else {
        const np = createProduct({ name: editName.trim(), sku: "", category: "Uncategorized", price: Number(editPrice) });
        productId = np.id;
      }
    }

    updatePurchaseItem(editItem.id, { item_name: editName.trim(), quantity: Number(editQty), price: Number(editPrice), product_id: productId });
    toast.success("Item updated");
    setEditItem(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deletePurchaseItem(deleteId);
      toast.success("Item deleted");
      setDeleteId(null);
    }
  };

  const SortButton = ({ label, sortKeyVal }: { label: string; sortKeyVal: SortKey }) => (
    <button onClick={() => toggleSort(sortKeyVal)} className="flex items-center gap-1 hover:text-foreground transition-colors">
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              Purchase Items ({items.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No purchase items yet. Add your first item above.</p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead><SortButton label="Item Name" sortKeyVal="item_name" /></TableHead>
                      <TableHead className="text-right"><SortButton label="Qty" sortKeyVal="quantity" /></TableHead>
                      <TableHead className="text-right"><SortButton label="Price" sortKeyVal="price" /></TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((item) => (
                      <TableRow key={item.id} className="group">
                        <TableCell className="font-medium">{item.item_name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${(item.quantity * item.price).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(item.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this purchase item? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Purchase Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Product</Label>
              <ProductSearch
                searchProducts={searchProducts}
                onSelect={(p) => { setEditName(p.name); setEditProductId(p.id); setEditPrice(p.price.toString()); }}
                onManualEntry={(name) => { setEditName(name); setEditProductId(null); }}
                value={editName}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" value={editQty} onChange={(e) => setEditQty(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Unit Price ($)</Label>
                <Input type="number" min="0" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
