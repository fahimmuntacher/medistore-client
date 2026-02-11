"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  BellRing,
  Pill,
  Stethoscope,
  Syringe,
  Activity,
  Thermometer,
  HeartPulse,
  Tablet,
  Microscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-20 container mx-auto px-4 sm:px-0">
      {/* Main Container */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card/80 dark:bg-card/60 backdrop-blur-xl px-8 py-12 md:px-16 md:py-16 shadow-xl transition-colors duration-300">

        {/* Floating Medical Icons */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none text-muted-foreground opacity-[0.08] dark:opacity-[0.05]">
          <Stethoscope className="absolute top-10 left-10 h-24 w-24 -rotate-12" />
          <Pill className="absolute bottom-10 left-1/4 h-16 w-16 rotate-45" />
          <Syringe className="absolute top-1/2 left-1/3 h-20 w-20 -rotate-90" />
          <Activity className="absolute top-20 right-1/4 h-28 w-28" />
          <Thermometer className="absolute bottom-20 right-1/3 h-20 w-20 rotate-12" />
          <HeartPulse className="absolute top-1/2 right-10 h-24 w-24 -rotate-12" />
          <Tablet className="absolute bottom-10 right-10 h-16 w-16" />
          <Microscope className="absolute top-1/3 left-10 h-20 w-20 rotate-12" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 dark:bg-primary/20 text-primary text-sm font-semibold transition-colors">
              <BellRing className="h-4 w-4" />
              <span>Stay Healthy, Stay Informed</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
              Subscribe to Our <br />
              <span className="text-primary">Health Letter</span>
            </h2>

            <p className="text-muted-foreground text-lg max-w-md mx-auto lg:mx-0">
              Get ৳200 discount on your first order. Subscribe for health tips and exclusive medicine offers.
            </p>
          </div>

          {/* Form Card */}
          <div className="relative z-20 bg-background/80 dark:bg-background/60 backdrop-blur-xl border border-border p-2 md:p-3 rounded-2xl md:rounded-3xl shadow-2xl max-w-lg mx-auto w-full transition-colors">

            {status === "success" ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="h-16 w-16 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground">
                    Awesome!
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Welcome to our community.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setStatus("idle")}
                  className="mt-2 rounded-xl"
                >
                  Done
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col md:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="h-14 pl-12 rounded-xl md:rounded-2xl bg-muted/40 dark:bg-muted/20 border-border focus-visible:ring-2 focus-visible:ring-primary/30 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  disabled={status === "loading"}
                  className="h-14 px-8 rounded-xl md:rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  {status === "loading" ? "Joining..." : "Subscribe"}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}

            <p className="mt-4 text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
              No Spam • Only Health • Cancel Anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
