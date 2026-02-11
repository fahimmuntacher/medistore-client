"use client";

import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formRef.current) return;

    emailjs
      .sendForm("service_b9ozcic", "template_tuxb6fr", formRef.current, {
        publicKey: "BRm2d7nKD3T6_xrCk",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          setSuccess(true);
          formRef.current?.reset();
          setLoading(false);
          setTimeout(() => setSuccess(false), 5000);
        },
        (error) => {
          console.log("FAILED...", error.text);
          alert("Email sending failed. Please check your console for details.");
          setLoading(false);
        },
      );
    console.log(formRef.current);
  };

  return (
    <section className="py-20 container mx-auto px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about your prescription or need medical advice? Our
            expert pharmacists are here to help you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="flex gap-6 p-6 rounded-3xl bg-card border border-border shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Email Us</h3>
                <p className="text-muted-foreground">support@medistore.com</p>
              </div>
            </div>

            <div className="flex gap-6 p-6 rounded-3xl bg-card border border-border shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Call Center</h3>
                <p className="text-muted-foreground">+880 1234 567 890</p>
              </div>
            </div>

            <div className="flex gap-6 p-6 rounded-3xl bg-card border border-border shadow-sm">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Visit Pharmacy</h3>
                <p className="text-muted-foreground">
                  Dhanmondi, Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            {success ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Message Sent!
                </h2>
                <p className="text-muted-foreground">
                  We will get back to you shortly.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSuccess(false)}
                  className="rounded-xl"
                >
                  Send Another
                </Button>
              </div>
            ) : (
             
              <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Full Name</label>
                    <Input
                      name="name" 
                      placeholder="John Doe"
                      className="rounded-xl h-12 bg-muted/50 border-border"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Email Address
                    </label>
                    <Input
                      name="email" 
                      type="email"
                      placeholder="john@example.com"
                      className="rounded-xl h-12 bg-muted/50 border-border"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Subject</label>
                  <Input
                    name="title" 
                    placeholder="Inquiry about Medicine"
                    className="rounded-xl h-12 bg-muted/50 border-border"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Message</label>
                  <Textarea
                    name="message"
                    placeholder="How can we help you?"
                    className="rounded-2xl min-h-[150px] bg-muted/50 border-border text-base"
                    required
                  />
                </div>

                {/* Button logic stays the same */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-lg font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
