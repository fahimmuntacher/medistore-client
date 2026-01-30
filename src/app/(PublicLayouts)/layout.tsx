import { Footer } from "@/components/Footer";
import { Navbar1 } from "@/components/navbar1";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex  flex-col justify-between min-h-screen">
    <Navbar1></Navbar1>
    <div className="flex-1">
        {children}
    </div>
    <Footer></Footer>
    </div>;
};

export default layout;
