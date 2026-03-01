"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/src/app/store/CartStore";
import {
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
import { MedicineSkeleton } from "@/components/MedicineSkeleton";
import { MedicineReviews } from "./MedicineReviews";
import { useUser } from "@/hooks/useSession";
import { medicineService } from "@/src/services";

const MedicinesDetails = () => {
  const { id } = useParams();
  // console.log("medi id", id);
  const [medicine, setMedicine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const { addItem } = useCartStore();
  // const { isLoggedIn } = useAuth();
  const {user} = useUser(); 

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        const res = await medicineService.getMedicineById(id as string);
        // console.log("single medi res", res);
        setMedicine(res);
        // console.log("medi", res);
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
      await addItem(medicine.id, medicine.price, !!user);
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <MedicineSkeleton />;
  if (!medicine)
    return (
      <div className="text-center py-20 font-bold">Medicine not found!</div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Link
        href="/medicines"
        className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Medicines
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Section */}
        <div className="lg:sticky lg:top-24">
          <Card className="overflow-hidden border-2 border-muted rounded-3xl bg-muted/10 shadow-sm">
            <CardContent className="p-0 aspect-square">
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: Info Section */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {medicine.category?.name}
              </Badge>
              <Badge
                variant="outline"
                className={
                  medicine.stock > 0
                    ? "text-green-600 border-green-200 bg-green-50"
                    : "text-red-600 border-red-200 bg-red-50"
                }
              >
                {medicine.stock > 0
                  ? `In Stock (${medicine.stock})`
                  : "Out of Stock"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-foreground">
                {medicine.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                Manufacturer:{" "}
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
                <span className="text-xl text-muted-foreground line-through opacity-60">
                  ৳{medicine.discountPrice}
                </span>
              )}
            </div>

            <div className="bg-muted/30 p-5 rounded-2xl border-l-4 border-primary/40 leading-relaxed text-muted-foreground">
              {medicine.description}
            </div>
          </div>

          <Separator />

          {/* Seller Details */}
          <div className="flex items-center justify-between p-4 bg-card border rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-muted">
                <img
                  src={medicine.seller?.image}
                  alt="seller"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Authorized Seller
                </p>
                <p className="text-md font-bold text-primary">
                  {medicine.seller?.name}
                </p>
              </div>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Store className="h-5 w-5 text-primary" />
            </div>
          </div>

          {/* Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={medicine.stock === 0 || adding}
            className="w-full h-14 text-lg font-bold rounded-2xl gap-3 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-[0.98]"
          >
            {adding ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <ShoppingCart className="h-6 w-6" />
            )}
            {medicine.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { icon: ShieldCheck, label: "100% Genuine" },
              { icon: Truck, label: "Express Delivery" },
              { icon: PackageCheck, label: "Secure Package" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-4 bg-muted/10 border rounded-2xl transition-colors hover:bg-muted/20"
              >
                <item.icon className="h-6 w-6 text-primary mb-2" />
                <span className="text-[10px] font-bold uppercase text-center text-muted-foreground tracking-tighter">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section - Moved Outside the main Grid for full width */}
      <div className="mt-20">
        <Separator className="mb-12" />
        <MedicineReviews reviews={medicine.reviews || []} />
      </div>
    </div>
  );
};

export default MedicinesDetails;
