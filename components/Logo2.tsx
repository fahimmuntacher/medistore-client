"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PlusCircle, Pill } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  url?: string;
}

const Logo2 = ({
  className,
  iconClassName,
  textClassName,
  showText = true,
  url = "/",
}: LogoProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 group transition-all active:scale-95",
        className,
      )}
    >
      {/* Logo Icon Container */}
      <div className="relative flex items-center justify-center">
        {/* Background Glow/Circle */}
        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/30 transition-colors" />

        {/* Main Icon */}
        <div className="relative bg-primary text-primary-foreground p-1.5 rounded-xl shadow-lg shadow-primary/20">
          <PlusCircle
            className={cn("h-6 w-6", iconClassName)}
            strokeWidth={2.5}
          />
        </div>

        {/* Secondary Floating Icon */}
        <div className="absolute -top-1 -right-1 bg-background border-2 border-primary rounded-full p-0.5 text-primary scale-75">
          <Pill className="h-3 w-3" fill="currentColor" />
        </div>
      </div>

      {/* Brand Name */}
      {showText && (
        <span
          className={cn(
            "text-xl font-black tracking-tight text-foreground",
            textClassName,
          )}
        >
          Medi<span className="text-primary">store</span>
        </span>
      )}
    </div>
  );
};

// Sub-components for individual parts if needed elsewhere
export const LogoImage = ({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) => {
  // If you ever want to switch to a PNG/SVG file easily
  return <div className={cn("h-10 w-10 bg-primary rounded-xl", className)} />;
};

export const LogoText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <span className={cn("text-xl font-bold", className)}>{children}</span>;

export { Logo2 };
