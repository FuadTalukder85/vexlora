"use client";

import React from "react";
import { Search, Loader2, ArrowRight } from "lucide-react";

interface OrderLookupFormProps {
  orderNumber: string;
  loading: boolean;
  onOrderNumberChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const OrderLookupForm: React.FC<OrderLookupFormProps> = ({
  orderNumber,
  loading,
  onOrderNumberChange,
  onSubmit,
}) => {
  return (
    <div className="bg-card rounded-3xl p-4 sm:p-6 border border-border shadow-sm mb-10 max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => onOrderNumberChange(e.target.value)}
            placeholder="e.g. ORD-M1ABC-9XYZ"
            className="w-full pl-11 pr-4 py-3.5 bg-muted rounded-2xl text-sm font-mono text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 border border-border"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !orderNumber.trim()}
          className="px-6 py-3.5 bg-primary hover:bg-highlight text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:hover:bg-primary active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Tracking...
            </>
          ) : (
            <>
              Track Status <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
