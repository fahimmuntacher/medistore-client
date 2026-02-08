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
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; slug: string }) => void;
  initialData?: { name: string; slug: string };
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
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  // slug generator
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
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
                    // Add মোডে থাকলে অটো স্লাগ জেনারেট হবে
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
