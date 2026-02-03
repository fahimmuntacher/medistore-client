"use client"
import { DashbaordSidebar } from "@/components/layouts/SideBar";
import { useAuth } from "@/hooks/useAuth";

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
      case "ADMIN": return admin;
      case "SELLER": return seller;
      case "CUSTOMER": return customer;
      default: return children;
    }
  };

  return (
    <DashbaordSidebar role={role }>
      {renderContent()}
    </DashbaordSidebar>
  );
};

export default Layout;