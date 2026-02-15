"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Eye, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getEffectivePrice } from "@/lib/etEffectivePrice";
import { useCartStore } from "@/src/app/store/CartStore";
import Link from "next/link";
import { Medicine } from "@/src/types/medicine";

export function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { isLoggedIn } = useAuth();
  const [adding, setAdding] = useState(false);
  const { addItem, loading: cartLoading } = useCartStore();
  // console.log("medicine from medicine card", medicine);
  const effectivePrice = getEffectivePrice(medicine);
  const hasDiscount = effectivePrice < medicine.price;
  const outOfStock = medicine.stock === 0;

  const rating =
    medicine.reviews.length > 0
      ? medicine.reviews.reduce((s, r) => s + r.rating, 0) /
        medicine.reviews.length
      : 0;

  // console.log(rating);
  // console.log("medicine review", rating);
  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock || cartLoading) return;
    setAdding(true);
    await addItem(medicine.id, effectivePrice, isLoggedIn);
    setAdding(false);
  };

  return (
    <Card className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-[10px] font-semibold text-destructive-foreground shadow">
            {Math.round((1 - effectivePrice / medicine.price) * 100)}% OFF
          </span>
        )}

        {/* Quick View */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/medicines/${medicine.id}`}>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full px-4 shadow-md"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
            {medicine.manufacturer}
          </p>

          <CardTitle className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {medicine.name}
          </CardTitle>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            ৳ {effectivePrice.toFixed(0)}
          </span>

          {hasDiscount && (
            <span className="text-xs line-through text-muted-foreground">
              ৳ {medicine.price.toFixed(0)}
            </span>
          )}
        </div>

        {/* Rating + Stock */}
        <div className="flex items-center justify-between text-xs">
          {rating > 0 ? (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">
                {rating.toFixed(1)}
              </span>
              <span className="font-bold text-yellow-500">({medicine.reviews.length})</span>
            </div>
          ) : (
            <span className="text-muted-foreground">No reviews</span>
          )}

          {outOfStock ? (
            <span className="text-destructive font-medium">Out</span>
          ) : (
            <span className="text-emerald-500 font-medium">In Stock</span>
          )}
        </div>
      </CardContent>

      {/* Action */}
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full rounded-xl font-semibold transition-all active:scale-95"
          disabled={outOfStock || adding}
          onClick={handleAdd}
        >
          {adding ? (
            "Adding..."
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
