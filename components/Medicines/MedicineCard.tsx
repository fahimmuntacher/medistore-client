"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useCart } from "@/src/providers/CartProvider";
import { getEffectivePrice } from "@/lib/cart-utils";
import { toast } from "sonner";


type Medicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  manufacturer: string;
  image: string;
  reviews: { rating: number }[];
};

export function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const effectivePrice = getEffectivePrice(medicine);
  const hasDiscount = effectivePrice < medicine.price;
  const outOfStock = medicine.stock === 0;
  const rating = medicine.reviews?.length
    ? medicine.reviews.reduce((sum, r) => sum + r.rating, 0) / medicine.reviews.length
    : 0;

  const handleAdd = async () => {
    if (outOfStock || adding) return;

    setAdding(true);

    try {
      await addToCart({
        medicineId: medicine.id,
        name: medicine.name,
        image: medicine.image,
        price: effectivePrice,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err : any) {
      toast.error("Add to cart failed", err?.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="relative aspect-4/3 bg-muted">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {Math.round((1 - effectivePrice / medicine.price) * 100)}% OFF
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-2 text-base leading-tight">
          {medicine.name}
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          {medicine.manufacturer}
        </p>
      </CardHeader>

      <CardContent className="px-4 pb-4 flex-1 flex flex-col gap-2 text-sm">
        <p className="line-clamp-2 text-muted-foreground">
          {medicine.description}
        </p>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold">
            ${effectivePrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${medicine.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs">
          {rating > 0 && (
            <>
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({medicine.reviews.length})
              </span>
            </>
          )}
        </div>

        <div className="mt-auto text-xs">
          {outOfStock ? (
            <span className="text-red-600 font-medium">Out of stock</span>
          ) : (
            <span className="text-green-700">In stock: {medicine.stock}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={outOfStock || adding}
          variant={outOfStock ? "secondary" : "default"}
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