export function MedicineCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-4/3 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-4/5 bg-muted rounded" />
        <div className="h-4 w-full bg-muted/70 rounded" />
        <div className="h-4 w-3/4 bg-muted/70 rounded" />
        <div className="h-5 w-1/2 bg-muted rounded mt-2" />
        <div className="h-10 w-full bg-muted rounded mt-4" />
      </div>
    </div>
  );
}