"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Home,
  Search,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-12 md:px-4">
      <div className="max-w-xl w-full text-center flex flex-col items-center">
        {/* Animated Icon Section */}
        <div className="relative mb-8 flex justify-center">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-primary/10 blur-[60px] md:blur-[100px] rounded-full scale-125 md:scale-150 animate-pulse" />

          <div className="relative bg-background border-2 border-primary/20 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl">
            <Stethoscope className="h-16 w-16 md:h-24 md:w-24 text-primary animate-bounce" />
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-destructive text-destructive-foreground p-1.5 md:p-2 rounded-full shadow-lg">
              <AlertCircle className="h-4 w-4 md:h-6 md:w-6" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-10">
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black text-muted-foreground/10 select-none leading-none">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight px-2">
            Oops! This Page is{" "}
            <span className="text-primary">Out of Stock</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-[280px] sm:max-w-md mx-auto leading-relaxed">
            The medical resource you are looking for might have been moved,
            removed, or is temporarily unavailable. Let's get you back to
            health!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 w-full max-w-xs sm:max-w-none">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 font-bold shadow-lg shadow-primary/20 h-12 md:h-14"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 font-bold h-12 md:h-14"
          >
            <Link href="/shop">
              <Search className="mr-2 h-5 w-5" />
              Browse Medicines
            </Link>
          </Button>
        </div>

        {/* Quick Back Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to previous page
        </button>

        {/* Bottom Decoration - Hidden on very small screens to save space */}
        <div className="hidden sm:grid pt-16 grid-cols-3 gap-4 opacity-20 grayscale w-full max-w-sm">
          <div className="h-1 bg-primary rounded-full" />
          <div className="h-1 bg-primary rounded-full" />
          <div className="h-1 bg-primary rounded-full" />
        </div>
      </div>
    </div>
  );
}
