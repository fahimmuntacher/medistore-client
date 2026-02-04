"use client";
import { DashbaordSidebar } from "@/components/layouts/SideBar";
import { useAuth } from "@/hooks/useAuth";
import { roles } from "@/src/constant/role";

interface LayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  seller: React.ReactNode;
  customer: React.ReactNode;
}

const Layout = ({ children, admin, seller, customer }: LayoutProps) => {
  const { user } = useAuth();
  const role = user?.role || "CUSTOMER";

  const renderContent = () => {
    switch (role) {
      case roles.admin:
        return admin;
      case roles.seller:
        return seller;
      case roles.customer:
        return customer;
      default:
        return children;
    }
  };

  return <DashbaordSidebar role={role}>{renderContent()}</DashbaordSidebar>;
};

export default Layout;
