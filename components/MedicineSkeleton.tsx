import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export const MedicineSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-6xl">
    {/* Back Button Skeleton */}
    <Skeleton className="h-5 w-32 mb-8 bg-muted-foreground/10" />
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Left: Image Skeleton - একে একটু ডার্ক রাখা হয়েছে যাতে ইমেজের শেপ বোঝা যায় */}
      <Skeleton className="aspect-square rounded-3xl w-full bg-muted-foreground/10 shadow-sm" />
      
      <div className="space-y-6">
        {/* Badges */}
        <div className="flex gap-3">
          <Skeleton className="h-6 w-20 rounded-md bg-muted-foreground/10" /> 
          <Skeleton className="h-6 w-24 rounded-md bg-muted-foreground/10" />
        </div>
        
        {/* Title & Brand */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-3/4 bg-muted-foreground/10" />
          <Skeleton className="h-6 w-1/2 bg-muted-foreground/10" />
        </div>
        
        {/* Price */}
        <Skeleton className="h-10 w-28 bg-muted-foreground/10" />
        
        {/* Description Box */}
        <Skeleton className="h-24 w-full rounded-xl bg-muted-foreground/10" />
        
        <Separator className="bg-muted-foreground/10" />
        
        {/* Seller Info Card */}
        <Skeleton className="h-20 w-full rounded-xl bg-muted-foreground/10 border border-muted" />
        
        {/* Add to Cart Button */}
        <Skeleton className="h-12 w-full rounded-xl bg-muted-foreground/10" />
        
        {/* Trust Badges Grid */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <Skeleton className="h-16 rounded-xl bg-muted-foreground/10" />
          <Skeleton className="h-16 rounded-xl bg-muted-foreground/10" />
          <Skeleton className="h-16 rounded-xl bg-muted-foreground/10" />
        </div>
      </div>
    </div>
  </div>
);