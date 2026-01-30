import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full">
      {/* Left side (Branding) */}
    {/* <div className="hidden lg:flex flex-col justify-center bg-muted px-16">
        <Logo/>
        <h1 className="mt-6 text-3xl font-bold">
          Welcome to MediStore
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage medicines, orders and users with ease.
        </p>
      </div> */}

      {/* Right side (Form) */}
      <div className="">
        {children}
      </div>
    </div>
  );
}
