
import { DashbaordSidebar } from "@/components/layouts/SideBar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <DashbaordSidebar>{children}</DashbaordSidebar>;
};

export default layout;
