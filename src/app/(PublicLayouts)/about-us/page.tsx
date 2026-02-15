"use client";

import React from "react";
import {
  ShieldCheck,
  Truck,
  Clock,
  Pill,
  ClipboardCheck,
  Search,
  ThermometerSnowflake,
  FileText,
  CheckCircle2,
  PackageCheck,
  MapPin,
  Building2,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AboutPage = () => {
  const productFocus = [
    {
      icon: <Pill />,
      title: "Prescription Medicine",
      desc: "100% genuine medicines from brands like Square, Incepta, and Beximco.",
    },
    {
      icon: <ThermometerSnowflake />,
      title: "Cold Chain Items",
      desc: "Insulin and vaccines maintained under 2°C - 8°C temperature.",
    },
    {
      icon: <FlaskConical />,
      title: "Healthcare Devices",
      desc: "Glucose monitors, BP machines, and nebulizers with official warranties.",
    },
    {
      icon: <HeartPulse className="h-6 w-6" />,
      title: "Wellness Products",
      desc: "Supplements, baby care, and personal hygiene essentials.",
    },
  ];

  const qualitySteps = [
    {
      title: "Direct Sourcing",
      desc: "We only source from ISO-certified manufacturers or their primary depots.",
    },
    {
      title: "Pharmacist Audit",
      desc: "Every prescription is cross-checked by a B.Pharm certified professional.",
    },
    {
      title: "Hygienic Packing",
      desc: "Tamper-proof, eco-friendly packaging to ensure zero contamination.",
    },
    {
      title: "Real-time Tracking",
      desc: "Track your healthcare package from our hub to your doorstep.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section: The Problem & Solution */}
      <section className="py-20 bg-muted/20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              Authentic Medicine <br />
              <span className="text-primary">Delivered Responsibly.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Medistore is a tech-enabled healthcare platform solving the
              problem of counterfeit medicines and inaccessible healthcare in
              Bangladesh. We operate a licensed centralized pharmacy model to
              ensure every single unit is verified.
            </p>
          </div>
        </div>
      </section>

      {/* Core Inventory Expertise */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productFocus.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Transparency: Quality Control */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-3xl font-bold tracking-tight">
                How We Ensure Quality
              </h2>
              <div className="space-y-6">
                {qualitySteps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {step.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="p-6 bg-card border border-border rounded-2xl space-y-3">
                <Building2 className="text-primary h-8 w-8" />
                <h4 className="font-bold">Licensed Hubs</h4>
                <p className="text-xs text-muted-foreground">
                  DGDA Approved Pharmacy License #123456
                </p>
              </div>
              <div className="p-6 bg-card border border-border rounded-2xl space-y-3">
                <MapPin className="text-primary h-8 w-8" />
                <h4 className="font-bold">64 Districts</h4>
                <p className="text-xs text-muted-foreground">
                  Full country-wide logistics support.
                </p>
              </div>
              <div className="p-6 bg-card border border-border rounded-2xl space-y-3">
                <CheckCircle2 className="text-primary h-8 w-8" />
                <h4 className="font-bold">No-Fake Policy</h4>
                <p className="text-xs text-muted-foreground">
                  10x money back if authenticity is proven false.
                </p>
              </div>
              <div className="p-6 bg-card border border-border rounded-2xl space-y-3">
                <PackageCheck className="text-primary h-8 w-8" />
                <h4 className="font-bold">Safe Storage</h4>
                <p className="text-xs text-muted-foreground">
                  All products kept in dust-free environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Stats (No Fluff) */}
      <section className="py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-1">15,000+</p>
              <p className="text-sm font-semibold text-muted-foreground uppercase">
                Unique Medicines
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-1">50+</p>
              <p className="text-sm font-semibold text-muted-foreground uppercase">
                Pharma Partners
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-1">2 Hours</p>
              <p className="text-sm font-semibold text-muted-foreground uppercase">
                Delivery In Dhaka
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-1">24/7</p>
              <p className="text-sm font-semibold text-muted-foreground uppercase">
                Pharmacist Support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Call to Action */}
      <section className="py-24 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Looking for a specific medicine?
          </h2>
          <p className="text-muted-foreground">
            Search our inventory or upload your prescription to get started with
            Medistore's reliable delivery.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/medicines">
              <Button size="lg" className="rounded-xl px-12">
                Browse Medicines
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-xl px-12">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// SVG Component for HeartPulse Icon
function HeartPulse(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
}

export default AboutPage;
