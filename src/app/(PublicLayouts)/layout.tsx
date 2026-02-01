import { Footer } from "@/components/Footer";
import { Navbar1 } from "@/components/navbar1";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50">
        <Navbar1 />
      </header>

      {/* Main content */}
      <main className="flex-1 bg-muted">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default layout;
