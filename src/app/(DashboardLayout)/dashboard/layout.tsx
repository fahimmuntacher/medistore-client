import { DashbaordSidebar } from "@/components/layouts/SideBar";

import { roles } from "@/src/constant/role";
import { userService } from "@/src/services/user.service";

interface LayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  seller: React.ReactNode;
  customer: React.ReactNode;
}

const Layout = async ({ children, admin, seller, customer }: LayoutProps) => {
  const sessionResponse = await userService.getSession();
  // console.log(sessionResponse);
  const userInfo = await sessionResponse?.data?.user;
  // console.log(userInfo);
  const role = userInfo?.role;
  // console.log(role);
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
