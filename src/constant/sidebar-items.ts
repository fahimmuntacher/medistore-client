// constants/sidebar-items.ts
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingBag,
  Users,
  Store,
  ListOrdered,
} from "lucide-react";

export const getSidebarData = (role: string) => {
  const baseGroups = {
    ADMIN: [
      {
        title: "Administration",
        items: [
          {
            label: "Dashbaord",
            icon: LayoutDashboard,
            href: "/dashboard",
          },
          {
            label: "Manage Users",
            icon: Users,
            href: "/dashboard/admin/users",
          },
          {
            label: "All Orders",
            icon: ClipboardList,
            href: "/dashboard/admin/orders",
          },
        ],
      },
    ],
    SELLER: [
      {
        title: "Store Management",
        items: [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard/seller",
          },
          {
            label: "My Medicines",
            icon: Store,
            href: "/dashboard/seller/medicines",
          },
          {
            label: "Sales Report",
            icon: ClipboardList,
            href: "/dashboard/seller/sales",
          },
        ],
      },
    ],
    CUSTOMER: [
      {
        title: "My Account",
        items: [
          {
            label: "Dashboard",
            icon: ShoppingBag,
            href: "/dashboard",
          },
          {
            label: "My Order",
            icon: ListOrdered,
            href: "/dashboard/customer/my-orders",
          },
          {
            label: "Love",
            icon: ClipboardList,
            href: "/dashboard/customer/prescriptions",
          },
        ],
      },
    ],
  };

  return baseGroups[role as keyof typeof baseGroups] || baseGroups.CUSTOMER;
};
