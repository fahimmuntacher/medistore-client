import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customerId: string;
}

export const MedicineReviews = ({ reviews }: { reviews: Review[] }) => {
  // এভারেজ রেটিং ক্যালকুলেশন
  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : 0;

  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">Customer Reviews</h2>
        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
          <span className="text-lg font-bold text-yellow-700">
            {averageRating} / 5
          </span>
          <span className="text-sm text-yellow-600 font-medium">
            ({reviews.length})
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-muted-foreground">
            No reviews yet for this medicine.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="border-none bg-muted/20 shadow-none"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Customer</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-muted-foreground leading-relaxed italic bg-muted">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
