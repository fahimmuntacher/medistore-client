"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, ImagePlus, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

// Zod Schema
const medicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(1, "Price must be at least 1"),
  stock: z.number().min(0, "Stock cannot be negative"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  image: z.string().min(1, "Image is required"),
  categoryId: z.string().min(1, "Category is required"),
});

type MedicineFormData = z.infer<typeof medicineSchema>;

export function AddMedicineModal({ trigger }: { trigger?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  // Categories Fetching
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });

  // Cloudinary Upload Logic
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.url;
  };

  // Create Medicine Mutation
  const { mutate: createMedicine, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: MedicineFormData) => {
      return api.post("/medicines", data);
    },
    onSuccess: () => {
      toast.success("Medicine added successfully!");
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      setIsOpen(false);
      form.reset();
      setSelectedFile(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to add medicine");
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      manufacturer: "",
      image: "",
      categoryId: "",
    } as MedicineFormData,
    onSubmit: async ({ value }) => {
      setIsUploading(true);
      try {
        let finalImageUrl = "";
        if (selectedFile) {
          finalImageUrl = await uploadToCloudinary(selectedFile);
        }
        createMedicine({ ...value, image: finalImageUrl });
      } catch (error) {
        toast.error("Image upload failed");
      } finally {
        setIsUploading(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <Field>
                <FieldLabel>Medicine Name</FieldLabel>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Paracetamol 500mg"
                />
              </Field>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="price">
              {(field) => (
                <Field>
                  <FieldLabel>Price (৳)</FieldLabel>
                  <Input
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="stock">
              {(field) => (
                <Field>
                  <FieldLabel>Stock</FieldLabel>
                  <Input
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                </Field>
              )}
            </form.Field>
          </div>

          <form.Field name="categoryId">
            {(field) => (
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select
                  onValueChange={field.handleChange}
                  value={field.state.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>

          <form.Field name="manufacturer">
            {(field) => (
              <Field>
                <FieldLabel>Manufacturer</FieldLabel>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="image">
            {(field) => (
              <Field>
                <FieldLabel>Image</FieldLabel>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      field.handleChange(file.name);
                    }
                  }}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting || isUploading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Save Medicine"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
