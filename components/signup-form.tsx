"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import SocialLogin from "@/src/shared/SocialLogin";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

// Zod schema with best practices
const formSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .toLowerCase()
      .trim(),
    image: z
      .string()
      .min(1, "Image is required")
      .refine((val) => {
        // Accept file input or URL
        if (val.startsWith("blob:") || val.startsWith("data:")) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      }, "Please provide a valid image URL or select a file"),
    role: z.enum(["SELLER", "CUSTOMER"], {
      message: "Please select a role",
    }),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Helper function to upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        let errorData;
        try {
          errorData = await uploadRes.json();
        } catch {
          errorData = { error: `Server error (${uploadRes.status})` };
        }

        // Handle specific status codes
        if (uploadRes.status === 500) {
          throw new Error(
            errorData.error ||
              "Server error during image upload. This might be due to missing Cloudinary configuration. Please contact support.",
          );
        }

        const errorMessage =
          errorData.error || `Image upload failed (${uploadRes.status})`;
        throw new Error(errorMessage);
      }

      const uploadData = await uploadRes.json();

      if (!uploadData.url) {
        throw new Error("Image upload succeeded but no URL was returned");
      }

      return uploadData.url;
    } catch (uploadError: any) {
      // Re-throw upload errors with context
      if (uploadError.message) {
        throw uploadError;
      }
      throw new Error("Failed to upload image. Please try again.");
    }
  };

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      image: "",
      role: "" as "SELLER" | "CUSTOMER" | "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }: { value: any }) => {
      // Validate with Zod before submission
      const result = formSchema.safeParse(value);

      if (!result.success) {
        console.error("Validation errors:", result.error.flatten());
        toast.error("Please fix the validation errors");
        return;
      }

      const toastId = toast.loading("Uploading image...");
      setIsUploading(true);

      try {
        let imageUrl = result.data.image;

        // If there's a selected file, upload it to Cloudinary first
        if (selectedImageFile) {
          try {
            imageUrl = await uploadImageToCloudinary(selectedImageFile);
            toast.loading("Registering user...", { id: toastId });
          } catch (uploadError: any) {
            toast.error(uploadError.message || "Failed to upload image", {
              id: toastId,
            });
            setIsUploading(false);
            return;
          }
        }

        // Now register the user with the Cloudinary image URL
        const { data, error } = await authClient.signUp.email({
          ...result.data,
          image: imageUrl, // Use the Cloudinary URL
        });

        if (error) {
          toast.error(error.message, { id: toastId });
          setIsUploading(false);
          return;
        }

        toast.success("User Registered Successfully", { id: toastId });
        console.log(data);

        // Reset form and state
        form.reset();
        setSelectedImageFile(null);
      } catch (error: any) {
        console.error("Registration error:", error);
        toast.error(error.message || "Something went wrong! Please try again", {
          id: toastId,
        });
      } finally {
        setIsUploading(false);
      }
    },
  });

  // Helper function to validate individual fields
  const validateField = (fieldName: keyof FormData, value: any) => {
    try {
      const fieldSchema = formSchema.shape[fieldName];
      if (fieldSchema) {
        fieldSchema.parse(value);
      }
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message;
      }
      return "Validation error";
    }
  };

  // Validate password match
  const validatePasswordMatch = (confirmPassword: string, password: string) => {
    if (confirmPassword && password !== confirmPassword) {
      return "Passwords do not match";
    }
    return undefined;
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center mt-4">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="register-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => validateField("name", value),
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor="user_name">
                        Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        type="text"
                        id="user_name"
                        placeholder="John Doe"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isUploading}
                      />
                      {isInvalid && (
                        <FieldError>
                          {field.state.meta.errors.join(", ")}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Email  */}
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => validateField("email", value),
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field className="md:col-span-2">
                      <FieldLabel htmlFor="user_email">
                        Email <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        type="email"
                        id="user_email"
                        placeholder="john.doe@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isUploading}
                      />
                      {isInvalid && (
                        <FieldError>
                          {field.state.meta.errors.join(", ")}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Image */}
              <form.Field
                name="image"
                validators={{
                  onChange: ({ value }) => validateField("image", value),
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field>
                      <FieldLabel htmlFor="user_image">
                        Profile Image{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        type="file"
                        id="user_image"
                        accept="image/*"
                        onBlur={field.handleBlur}
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Store the actual file for later upload
                            setSelectedImageFile(file);
                            // Create a blob URL for validation
                            const url = URL.createObjectURL(file);
                            field.handleChange(url);
                          }
                        }}
                      />
                      {isInvalid && (
                        <FieldError>
                          {field.state.meta.errors.join(", ")}
                        </FieldError>
                      )}
                      {selectedImageFile && !isInvalid && (
                        <FieldDescription>
                          Selected: {selectedImageFile.name} (
                          {(selectedImageFile.size / 1024).toFixed(2)} KB)
                        </FieldDescription>
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Role*/}
              <form.Field
                name="role"
                validators={{
                  onChange: ({ value }) => validateField("role", value),
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field>
                      <FieldLabel htmlFor="user_role">
                        Role <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as "SELLER" | "CUSTOMER")
                        }
                        disabled={isUploading}
                      >
                        <SelectTrigger id="user_role" className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="SELLER">Seller</SelectItem>
                          <SelectItem value="CUSTOMER">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError>
                          {field.state.meta.errors.join(", ")}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Password  */}
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => validateField("password", value),
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field>
                      <FieldLabel htmlFor="user_password">
                        Password <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        type="password"
                        id="user_password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isUploading}
                      />
                      {isInvalid && (
                        <FieldError>
                          {field.state.meta.errors.join(", ")}
                        </FieldError>
                      )}
                      {!isInvalid && field.state.value === "" && (
                        <FieldDescription>
                          8+ chars with uppercase, lowercase, and number
                        </FieldDescription>
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Confirm Password*/}
              <form.Field
                name="confirmPassword"
                validators={{
                  onChangeListenTo: ["password"],
                  onChange: ({ value, fieldApi }) => {
                    const password = fieldApi.form.getFieldValue("password");

                    // First validate the field itself
                    const baseError = validateField("confirmPassword", value);
                    if (baseError) return baseError;

                    // Then check if passwords match
                    return validatePasswordMatch(value, password);
                  },
                }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <Field>
                      <FieldLabel htmlFor="user_confirm_password">
                        Confirm Password{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        type="password"
                        id="user_confirm_password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isUploading}
                      />
                      {isInvalid && (
                        <FieldError>
                          {field.state.meta.errors.join(", ")}
                        </FieldError>
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3.5 items-center justify-center">
          <Button
            form="register-form"
            className="w-full"
            type="submit"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Register now"}
          </Button>

          <SocialLogin></SocialLogin>
          <FieldDescription className="text-center mt-2.5">
            Already have an account? <Link href="/login">Log in</Link>
          </FieldDescription>
        </CardFooter>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="#" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
