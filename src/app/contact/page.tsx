"use client";

import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { useState } from "react";
import { Mail, Github, Instagram, Send, Loader2, CheckCircle, LucideIcon } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send message. Please check your connection.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 min-h-screen">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/15"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch</h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          Have a question about AeroWeather or interested in working together? Send a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-12">
          <GlassCard className="p-8 md:p-12">
            {status === "success" ? (
              <div className="py-12 text-center flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                  <p className="text-white/60">Thank you for reaching out. I&apos;ll get back to you as soon as possible.</p>
                </div>
                <button 
                  onClick={() => setStatus("idle")}
                  className="px-8 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-bold transition-all hover:bg-white/20"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 uppercase tracking-widest ml-1">Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Enter your name"
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-white/40 uppercase tracking-widest ml-1">Email</label>
                    <input
                      required
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-white/40 uppercase tracking-widest ml-1">Message</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Tell me what's on your mind..."
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20 resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-sm ml-1 font-medium italic">{errorMessage}</p>
                )}

                <button
                  disabled={status === "loading"}
                  type="submit"
                  className="w-full py-5 rounded-2xl bg-indigo-600 border border-indigo-400/30 text-white font-bold text-lg transition-all hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </GlassCard>
        </div>

        <div className="md:col-span-12 mt-8">
          <div className="flex flex-wrap justify-center gap-8">
            <ContactOption 
              icon={Mail} 
              label="Email" 
              value="rickd7587@gmail.com" 
              href="mailto:rickd7587@gmail.com" 
            />
            <ContactOption 
              icon={Github} 
              label="GitHub" 
              value="github.com/RKEX" 
              href="https://github.com/RKEX" 
            />
            <ContactOption 
              icon={Instagram} 
              label="Instagram" 
              value="@mr_rkex" 
              href="https://www.instagram.com/mr_rkex/" 
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactOption({ icon: Icon, label, value, href }: { icon: LucideIcon, label: string, value: string, href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest leading-none mb-1">{label}</h4>
        <p className="text-white font-medium group-hover:text-indigo-300 transition-colors">{value}</p>
      </div>
    </a>
  );
}
