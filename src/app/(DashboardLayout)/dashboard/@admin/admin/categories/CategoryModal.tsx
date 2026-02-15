"use client";

import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pill, Syringe, Stethoscope, FlaskConical, HeartPulse, Thermometer, Baby, Activity, PlusCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// পপুলার মেডিকেল আইকনগুলোর একটি লিস্ট
const MEDICAL_ICONS = [
  { name: "Pill", icon: Pill },
  { name: "Syringe", icon: Syringe },
  { name: "Stethoscope", icon: Stethoscope },
  { name: "FlaskConical", icon: FlaskConical },
  { name: "HeartPulse", icon: HeartPulse },
  { name: "Thermometer", icon: Thermometer },
  { name: "Baby", icon: Baby },
  { name: "Activity", icon: Activity },
  { name: "PlusCircle", icon: PlusCircle },
];

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; slug: string; icon: string }) => void;
  initialData?: { name: string; slug: string; icon?: string };
  isLoading: boolean;
  mode: "add" | "edit";
}

export const CategoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  mode,
}: CategoryFormProps) => {
  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      icon: initialData?.icon ?? "Pill", // ডিফল্ট আইকন
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 pt-4"
        >
          {/* Name Field */}
          <form.Field
            name="name"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Category Name</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (mode === "add") {
                      form.setFieldValue("slug", generateSlug(e.target.value));
                    }
                  }}
                  placeholder="e.g. Antibiotics"
                />
              </div>
            )}
          />

          {/* Slug Field */}
          <form.Field
            name="slug"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Slug</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. antibiotics"
                />
              </div>
            )}
          />

          {/* Icon Selection Field */}
          <form.Field
            name="icon"
            children={(field) => (
              <div className="space-y-3">
                <Label>Select Category Icon</Label>
                <div className="grid grid-cols-5 gap-2">
                  {MEDICAL_ICONS.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => field.handleChange(item.name)}
                        className={cn(
                          "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all hover:bg-primary/5",
                          field.state.value === item.name
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground"
                        )}
                      >
                        <IconComp className="h-5 w-5" />
                      </button>
                    );
                  })}
                </div>
                {/* Custom icon name input (optional) */}
                <p className="text-[10px] text-muted-foreground italic">
                  Selected: <span className="font-bold text-primary">{field.state.value}</span>
                </p>
              </div>
            )}
          />

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};