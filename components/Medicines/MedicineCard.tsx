"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getEffectivePrice } from "@/lib/etEffectivePrice";
import { useCartStore } from "@/src/app/store/CartStore";
import Link from "next/link";
import { Medicine } from "@/src/types/medicine";

export function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { isLoggedIn } = useAuth();
  // const addToCart = useCartStore(s => s.add)

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const effectivePrice = getEffectivePrice(medicine);
  // console.log("effective price", effectivePrice);
  const hasDiscount = effectivePrice < medicine.price;
  const outOfStock = medicine.stock === 0;
  const rating =
    medicine.reviews.length > 0
      ? medicine.reviews.reduce((s, r) => s + r.rating, 0) /
        medicine.reviews.length
      : 0;
  const { addItem, loading: cartLoading } = useCartStore();

  const handleAdd = async () => {
    if (outOfStock || cartLoading) return;
    setAdding(true);
    await addItem(medicine.id, effectivePrice, isLoggedIn);
    setAdding(false);
  };

  return (
    <Card className="flex h-full flex-col justify-between overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/medicines/${medicine.id}`}>
        {/* Image */}
        <div className="relative aspect-4/3 bg-muted">
          <img
            src={medicine.image}
            alt={medicine.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />

          {hasDiscount && (
            <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
              {Math.round((1 - effectivePrice / medicine.price) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Header */}
        <CardHeader className="p-4 pb-2">
          <CardTitle className="line-clamp-2 text-base">
            {medicine.name}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {medicine.manufacturer}
          </p>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex flex-1 flex-col gap-2 px-4 pb-4 text-sm">
          <p className="line-clamp-2 text-muted-foreground">
            {medicine.description}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
              ৳ {effectivePrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm line-through text-muted-foreground">
                ৳ {medicine.price.toFixed(2)}
              </span>
            )}
          </div>

          {rating > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({medicine.reviews.length})
              </span>
            </div>
          )}

          <div className="mt-auto text-xs">
            {outOfStock ? (
              <span className="font-medium text-red-600">Out of stock</span>
            ) : (
              <span className="text-green-700">In stock: {medicine.stock}</span>
            )}
          </div>
        </CardContent>
      </Link>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={outOfStock || adding}
          onClick={handleAdd}
        >
          {outOfStock
            ? "Out of Stock"
            : adding
              ? "Adding..."
              : added
                ? "Added ✓"
                : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
