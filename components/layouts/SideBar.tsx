"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Link as LinkIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { generateBreadcrumbs } from "@/src/helpers/generateBreadcrumbs";
import { getSidebarData } from "@/src/constant/sidebar-items";
import { SidebarProfileCard } from "./SidebarProfileCardProps";
import { Logo2 } from "../Logo2";

// types
type SidebarData = {
  logo: {
    src: string;
    alt: string;
    title: string;
    description: string;
  };
};

const sidebarData: SidebarData = {
  logo: {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.svg",
    alt: "Logo",
    title: "Medistore",
    description: "Healthcare Solution",
  },
};

const SidebarLogo = ({ logo }: { logo: SidebarData["logo"] }) => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" asChild>
        <Link href="/">
          <div className="flex flex-col gap-0.5 leading-none">
            <Logo2></Logo2>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);

const AppSidebar = ({
  role,
  ...props
}: { role?: string } & React.ComponentProps<typeof Sidebar>) => {
  const navGroups = getSidebarData(role as string);
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarLogo logo={sidebarData.logo} />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.label}
                      >
                        <Link href={item.href}>
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/settings">
                  <Settings className="size-4" />
                  <span>My Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter> */}

      <SidebarFooter>
        <SidebarGroup>
          <SidebarProfileCard />
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

interface DashboardSidebarProps {
  className?: string;
  children: React.ReactNode;
  role?: string;
}

const DashbaordSidebar = ({
  className,
  children,
  role,
}: DashboardSidebarProps) => {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <SidebarProvider className={cn(className)}>
      <AppSidebar role={role} />

      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              {/* <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Overv</BreadcrumbLink>
              </BreadcrumbItem> */}

              {breadcrumbs.map((crumb) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {crumb.isLast ? (
                      <BreadcrumbPage className="capitalize">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href} className="capitalize">
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export { DashbaordSidebar };
