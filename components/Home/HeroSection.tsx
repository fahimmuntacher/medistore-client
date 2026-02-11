"use client";

import * as React from "react";
import { ArrowRight, ShieldCheck, Pill, Truck, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";

export const HeroSection = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const slides = [
    {
      url: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1000&auto=format&fit=crop",
      title: "Genuine Pharmacy",
    },
    {
      url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1000&auto=format&fit=crop",
      title: "Fast Delivery",
    },
    {
      url: "https://images.unsplash.com/photo-1580281657527-47f249e8f6c4?q=80&w=1000&auto=format&fit=crop",
      title: "Health Care",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px]" />

      <section className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24 items-center">
        {/* LEFT CONTENT */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="px-4 py-1 border-primary/20 bg-primary/5 text-primary"
            >
              <Activity className="mr-2 h-3.5 w-3.5" />
              Trusted by 10k+ Families
            </Badge>

            <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl leading-[1.1]">
              Your Health, <br />
              <span className="bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Our Priority.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Experience the future of healthcare. Get genuine medicines and
              healthcare products delivered to your doorstep with priority
              speed.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/medicines">
              <Button
                size="lg"
                className="h-12 px-8 rounded-full shadow-lg shadow-primary/20"
              >
                Order Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Stats with Icons */}
          <div className="flex gap-10 pt-4 border-t border-border w-fit">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">10k+</span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Customers
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">500+</span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sellers
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">24/7</span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Support
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT CAROUSEL SECTION */}
        <div className="relative group animate-in fade-in zoom-in duration-1000">
          <Carousel
            opts={{ loop: true }}
            setApi={setApi}
            // plugins={[autoplay({ delay: 4000 })]}
            className="w-full"
          >
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative p-1">
                    <Card className="border-none overflow-hidden shadow-2xl rounded-[2rem]">
                      <CardContent className="p-0 relative">
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />

                        <img
                          src={slide.url}
                          alt={slide.title}
                          className="aspect-4/3 w-full object-cover transform transition-transform duration-500 hover:scale-105"
                        />

                        {/* Slide Title Overlay */}
                        <div className="absolute bottom-8 left-8 z-20">
                          <p className="text-white font-medium tracking-widest uppercase text-xs mb-2">
                            Exclusive Partner
                          </p>
                          <h3 className="text-2xl font-bold text-white">
                            {slide.title}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Carousel Progress Indicators */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-primary" : "w-2 bg-primary/20"
                }`}
              />
            ))}
          </div>

          {/* Floating Trust Card */}
          <Card className="absolute -bottom-10 -left-6 hidden md:block z-30 shadow-xl border-primary/10 animate-bounce-slow">
            <CardContent className="flex items-center gap-4 p-5 bg-white/90 backdrop-blur-md rounded-xl">
              <div className="bg-primary/10 p-2 rounded-full">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">100% Genuine</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
                  Certified Medicines
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Floating Icon */}
          <div className="absolute -top-6 -right-6 bg-blue-600 p-4 rounded-2xl shadow-xl hidden md:block rotate-12">
            <Truck className="h-6 w-6 text-white" />
          </div>
        </div>
      </section>
    </div>
  );
};
