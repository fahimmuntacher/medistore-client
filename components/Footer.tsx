"use client";

import { cn } from "@/lib/utils";
import { Logo, LogoImage, LogoText } from "@/components/logo";
import { Pill, Stethoscope, Syringe, Thermometer, ShieldCheck, HeartPulse } from "lucide-react";
import { Logo2 } from "./Logo2";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface FooterProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  logo = {
    src: "/logo.svg", // আপনার লোগো পাথ দিন
    alt: "Medistore Logo",
    title: "Medistore",
    url: "/",
  },
  className,
  tagline = "Bangladesh's Most Trusted Online Pharmacy. Delivering 100% Authentic Medicines 24/7.",
  menuItems = [
    {
      title: "Shop by Category",
      links: [
        { text: "Prescription Medicine", url: "/category/medicine" },
        { text: "Diabetes Care", url: "/category/diabetes" },
        { text: "Baby Care", url: "/category/baby" },
        { text: "Personal Care", url: "/category/personal" },
        { text: "Healthcare Devices", url: "/category/devices" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "/about" },
        { text: "Our Quality Process", url: "/quality" },
        { text: "Careers", url: "/careers" },
        { text: "Contact Us", url: "/contact" },
        { text: "Partner with Us", url: "/partner" },
      ],
    },
    {
      title: "Quick Support",
      links: [
        { text: "Upload Prescription", url: "/prescription" },
        { text: "Order Tracking", url: "/track-order" },
        { text: "Refund Policy", url: "/refund-policy" },
        { text: "FAQs", url: "/faq" },
        { text: "Shipping Info", url: "/shipping" },
      ],
    },
    {
      title: "Connect",
      links: [
        { text: "Facebook", url: "https://facebook.com" },
        { text: "Instagram", url: "https://instagram.com" },
        { text: "LinkedIn", url: "https://linkedin.com" },
        { text: "Youtube", url: "https://youtube.com" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} Medistore Bangladesh. All rights reserved.`,
  bottomLinks = [
    { text: "Terms and Conditions", url: "/terms" },
    { text: "Privacy Policy", url: "/privacy" },
    { text: "Cookie Policy", url: "/cookies" },
  ],
}: FooterProps) => {
  return (
    <section className={cn("relative py-16 border-t overflow-hidden bg-background", className)}>
      {/* Background Decorative Icons (Watermark Pattern) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <Pill className="absolute top-10 left-10 h-24 w-24 -rotate-12" />
        <Stethoscope className="absolute bottom-10 right-20 h-32 w-32 rotate-12" />
        <Syringe className="absolute top-1/2 left-1/4 h-20 w-20 -rotate-45" />
        <Thermometer className="absolute top-20 right-1/4 h-16 w-16 rotate-45" />
        <HeartPulse className="absolute bottom-1/4 left-10 h-28 w-28 opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <footer>
          <div className="grid grid-cols-2 gap-10 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <Logo2></Logo2>
              </div>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-sm">
                {tagline}
              </p>
              
              {/* Trust Badges */}
              <div className="mt-6 flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                <div className="flex items-center gap-1">
                   <ShieldCheck className="h-4 w-4 text-green-500" />
                   100% Authentic
                </div>
                <div className="flex items-center gap-1">
                   <Truck className="h-4 w-4 text-primary" />
                   Fast Delivery
                </div>
              </div>
            </div>

            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx} className="col-span-1">
                <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a 
                        href={link.url} 
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col justify-between gap-6 border-t border-border pt-10 text-xs font-medium text-muted-foreground md:flex-row md:items-center">
            <p>{copyright}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {bottomLinks.map((link, linkIdx) => (
                <a 
                  key={linkIdx} 
                  href={link.url} 
                  className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

// Truck icon missing in lucide import list above
function Truck(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v7" />
        <path d="M13 9h4" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    )
  }

export { Footer };