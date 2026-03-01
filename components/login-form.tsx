"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import SocialLogin from "@/src/shared/SocialLogin";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Zod schema for login form
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }: { value: any }) => {
      // Validate with Zod before submission
      const result = loginSchema.safeParse(value);

      if (!result.success) {
        console.error("Validation errors:", result.error.flatten());
        return;
      }

      // console.log("Login submitted successfully:", result.data);
      try {
        const toastId = toast.loading("Hold on, we're getting you in...");
        const { data, error } = await authClient.signIn.email(value);
        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        if (data) {
          // console.log(data);
          router.push("/");
          toast.success("Great to see you again!", { id: toastId });
        }
        // console.log(data);
      } catch (error) {
        toast.error("Something went wrong, Please try again!");
      }
    },
  });

  // Helper function to validate individual fields
  const validateField = (fieldName: keyof LoginFormData, value: any) => {
    try {
      const fieldSchema = loginSchema.shape[fieldName];
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center mt-4">
          <CardTitle className="text-xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {/* Email */}
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
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
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

              {/* Password */}
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
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
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

              <Field>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <SocialLogin />
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="underline">
                    Register Now
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
