# Product Connect - Inventory & Checkout Management

A React-based inventory and checkout management system with localStorage persistence.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18 + Vite |
| **Language** | TypeScript |
| **UI** | shadcn/ui (Radix UI + Tailwind CSS) |
| **State** | React hooks + localStorage |
| **Routing** | React Router DOM |
| **Forms** | React Hook Form + Zod |
| **Build** | TypeScript + ESLint |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      App.tsx                               │
│  ┌─────────────────┐  ┌─────────────────────────────────┐ │
│  │ QueryClient    │  │ BrowserRouter                  │ │
│  │ (React Query) │  │ / → Index (Checkout)           │ │
│  └──────────────┘  │ /inventory → Inventory      │ │
│                    └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          │                                     │
          ▼                                     ▼
┌─────────────────────┐             ┌─────────────────────┐
│   Checkout Page    │             │  Inventory Page   │
│   (Index.tsx)    │◄───────────►│ (Inventory.tsx)  │
│                  │             │                  │
│ • Add items     │             │ • View products │
│ • View items  │             │ • Add product │
│ • Edit       │             │ • Edit qty    │
│ • Delete     │             │ • View stock │
└─────────────────────┘             └─────────────────────┘
          │                                     │
          └───────────────────┬───────────────────┘
                          ▼
        ┌─────────────────────────────────────┐
        │      useInventoryStore.ts           │
        │   (Global State + localStorage)    │
        │                             │
        │ • products[]               │
        │ • purchaseItems[]         │
        │ • CRUD operations       │
        │ • searchProducts()       │
        │ • persistence          │
        └─────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   localStorage       │
              │ • inventory_products│
              │ • inventory_purchase│
              └────────────���──────────┘
```

---

## Data Models

### Product
```typescript
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  created_at: string;
}
```

### PurchaseItem
```typescript
interface PurchaseItem {
  id: string;
  product_id: string | null;
  item_name: string;
  quantity: number;
  price: number;
  created_at: string;
}
```

---

## User Flows

### Checkout Flow (Add Purchase Item)
```
1. User opens app → Checkout page loads
2. Search for product OR manually enter item name
3. If similar found → Suggest existing product
4. Enter quantity and unit price
5. Click "Add Item" → Added to purchase list
6. Item appears in table with total value
```

### Inventory Flow (Manage Stock)
```
1. Click "Inventory" button in header
2. View all products with quantities
3. See total stock & total value stats
4. Click "Add Product" → Fill form → Save
5. Click edit icon → Update quantity
```

---

## Pages

| Route | Page | Description |
|-------|------|-----------|
| `/` | Checkout | Add & manage purchase items |
| `/inventory` | Inventory | Manage product stock |

---

## Features

- [x] Product search with autocomplete
- [x] Similar product suggestions
- [x] Add/Edit/Delete purchase items
- [x] Add/Edit products in inventory
- [x] Quantity tracking per product
- [x] Sortable tables (name, qty, price, date)
- [x] Pagination (10 items/page)
- [x] Total value calculation
- [x] localStorage persistence
- [x] Seed data on first load
- [x] Navigation between Checkout & Inventory

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

---

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── PurchaseItemForm.tsx
│   ├── PurchaseItemTable.tsx
│   └── ProductSearch.tsx
├── hooks/
│   └── useInventoryStore.ts    # State management
├── pages/
│   ├── Index.tsx              # Checkout page
│   └── Inventory.tsx          # Inventory page
├── types/
│   └── inventory.ts          # TypeScript interfaces
├── App.tsx                  # Main app with routes
├── main.tsx                 # Entry point
└── index.css               # Global styles
```