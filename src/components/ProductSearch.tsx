import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types/inventory";

interface ProductSearchProps {
  onSelect: (product: Product) => void;
  onManualEntry: (name: string) => void;
  searchProducts: (query: string) => Product[];
  value?: string;
  placeholder?: string;
}

export function ProductSearch({ onSelect, onManualEntry, searchProducts, value = "", placeholder = "Search products by name, SKU, or category..." }: ProductSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (val: string) => {
      setQuery(val);
      setActiveIndex(-1);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const res = searchProducts(val);
        setResults(res);
        setIsOpen(val.trim().length > 0);
      }, 300);
    },
    [searchProducts]
  );

  const handleSelect = (product: Product) => {
    setQuery(product.name);
    setIsOpen(false);
    onSelect(product);
  };

  const handleManualEntry = () => {
    setIsOpen(false);
    onManualEntry(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    const total = results.length + 1; // +1 for manual entry option
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => (i + 1) % total); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => (i - 1 + total) % total); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) handleSelect(results[activeIndex]);
      else handleManualEntry();
    } else if (e.key === "Escape") setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg animate-fade-in overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {results.map((product, i) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                  i === activeIndex ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sku} · {product.category}</p>
                </div>
                <span className="text-xs font-medium text-primary">${product.price.toFixed(2)}</span>
              </button>
            ))}
            {query.trim() && (
              <button
                onClick={handleManualEntry}
                className={`w-full text-left px-4 py-3 flex items-center gap-2 border-t transition-colors ${
                  activeIndex === results.length ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <Plus className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">Add "{query}" as new product</span>
              </button>
            )}
            {!query.trim() && results.length === 0 && (
              <p className="px-4 py-3 text-sm text-muted-foreground">Start typing to search...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
