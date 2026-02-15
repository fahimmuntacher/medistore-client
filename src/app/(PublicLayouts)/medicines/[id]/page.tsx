"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/src/app/store/CartStore";
import {
  Plus,
  Minus,
  ShoppingCart,
  ChevronLeft,
  Store,
  ShieldCheck,
  PackageCheck,
  Truck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { MedicineSkeleton } from "@/components/MedicineSkeleton";

const MedicinesDetails = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { addItem } = useCartStore();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/medicines/${id}`);
        setMedicine(res.data);
      } catch (error) {
        toast.error("Could not load medicine details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMedicine();
  }, [id]);

  const handleAddToCart = async () => {
    if (!medicine) return;

    setAdding(true);
    try {
      await addItem(medicine.id, medicine.price, !!isLoggedIn);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <MedicineSkeleton></MedicineSkeleton>;
  }

  if (!medicine)
    return (
      <div className="text-center py-20 font-bold">Medicine not found!</div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link
        href="/medicines"
        className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-8"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Medicines
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Section */}
        <div className="lg:sticky lg:top-24">
          <Card className="overflow-hidden border-2 border-muted rounded-3xl bg-muted/20">
            <CardContent className="p-0 aspect-square">
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-full h-full object-cover"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: Info Section */}
        <div className="flex flex-col">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="secondary"
                className="rounded-md px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase"
              >
                {medicine.category?.name}
              </Badge>
              <Badge
                className={
                  medicine.stock > 0
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }
              >
                {medicine.stock > 0
                  ? `In Stock (${medicine.stock})`
                  : "Out of Stock"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-black text-foreground">
                {medicine.name}
              </h1>
              <p className="text-lg text-muted-foreground font-semibold">
                Brand:{" "}
                <span className="text-foreground font-bold">
                  {medicine.manufacturer}
                </span>
              </p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-primary">
                ৳{medicine.price}
              </span>
              {medicine.discountPrice > 0 && (
                <span className="text-xl text-muted-foreground line-through">
                  ৳{medicine.discountPrice}
                </span>
              )}
            </div>

            <div className="bg-muted/30 p-4 rounded-xl border-l-4 border-primary">
              <p className="text-muted-foreground leading-relaxed">
                {medicine.description}
              </p>
            </div>

            <Separator />

            {/* Seller Details */}
            <div className="flex items-center justify-between p-4 bg-background border-2 border-muted rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border">
                  <img
                    src={medicine.seller?.image}
                    alt="seller"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    Seller
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {medicine.seller?.name}
                  </p>
                </div>
              </div>
              <Store className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Quantity and Cart Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              {/* <div className="flex items-center border-2 border-muted rounded-xl p-1 bg-background w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-bold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div> */}

              <Button
                onClick={handleAddToCart}
                disabled={medicine.stock === 0 || adding}
                className="w-full h-12 text-md font-bold rounded-xl gap-2 px-8"
              >
                {adding ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )}
                {medicine.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {[
                { icon: ShieldCheck, label: "Genuine" },
                { icon: Truck, label: "Fast Delivery" },
                { icon: PackageCheck, label: "Secure" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-3 border rounded-xl"
                >
                  <item.icon className="h-5 w-5 text-primary mb-1" />
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicinesDetails;
