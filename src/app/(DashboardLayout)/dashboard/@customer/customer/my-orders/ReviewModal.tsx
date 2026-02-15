"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";

interface ReviewModalProps {
  medicineId: string;
  orderId: string;
  medicineName: string;
}

export const ReviewModal = ({
  medicineId,
  orderId,
  medicineName,
}: ReviewModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      comment: "",
    },
    onSubmit: async ({ value }) => {
      if (rating === 0) return toast.error("Please select a rating");

      try {
        await api.post("/reviews", {
          medicineId,
          orderId,
          rating,
          comment: value.comment,
        });
        toast.success("Review submitted successfully!");
        queryClient.invalidateQueries({ queryKey: ["my-orders"] });
        setIsOpen(false);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          Review Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review {medicineName}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6 pt-4"
        >
          {/* Star Rating Section */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium">
              How would you rate this medicine?
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      (hover || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Field */}
          <form.Field
            name="comment"
            children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Your Feedback (Optional)
                </label>
                <Textarea
                  placeholder="Tell us about your experience..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="resize-none h-24"
                />
              </div>
            )}
          />

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.state.isSubmitting}>
              {form.state.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
