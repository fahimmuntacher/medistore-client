import { LoginForm } from "@/components/login-form";
import { Logo2 } from "@/components/Logo2";
import { PillBottle } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="bg-muted flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full flex  flex-col gap-6 max-w-sm">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
         <Logo2></Logo2>
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
