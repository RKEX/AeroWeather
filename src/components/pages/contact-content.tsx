"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { GlassCard } from "@/components/ui/glass-card";
import { Link } from "@/navigation";
import {
    CheckCircle,
    Github,
    Instagram,
    Loader2,
    LucideIcon,
    Mail,
    Send,
} from "lucide-react";
import { useState } from "react";

export default function ContactContent() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
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
        setErrorMessage(data.error || t("contactErrorGeneric"));
      }
    } catch {
      setStatus("error");
      setErrorMessage(t("contactErrorNetwork"));
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-20">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/15">
          ← {t("backToHome")}
        </Link>
      </div>

      <div className="mb-12 text-center">
        <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
          {t("contactTitle")}
        </h1>
        <p className="mx-auto max-w-xl text-lg text-white/60">
          {t("contactSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-12">
          <GlassCard className="p-8 md:p-12">
            {status === "success" ?
              <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-6 py-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
                <div>
                  <h2 className="mb-2 text-2xl font-bold text-white">
                    {t("contactMessageSentTitle")}
                  </h2>
                  <p className="text-white/60">
                    {t("contactMessageSentBody")}
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="rounded-2xl border border-white/20 bg-white/10 px-8 py-3 font-bold text-white transition-all hover:bg-white/20">
                  {t("contactSendAnother")}
                </button>
              </div>
            : <form
                onSubmit={handleSubmit}
                className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold tracking-widest text-white/40 uppercase">
                      {t("contactName")}
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={t("contactNamePlaceholder")}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all placeholder:text-white/20 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="ml-1 text-sm font-bold tracking-widest text-white/40 uppercase">
                      {t("contactEmail")}
                    </label>
                    <input
                      required
                      type="email"
                      placeholder={t("contactEmailPlaceholder")}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all placeholder:text-white/20 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-bold tracking-widest text-white/40 uppercase">
                    {t("contactMessage")}
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder={t("contactMessagePlaceholder")}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all placeholder:text-white/20 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                {status === "error" && (
                  <p className="ml-1 text-sm font-medium text-red-400 italic">
                    {errorMessage}
                  </p>
                )}

                <button
                  disabled={status === "loading"}
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-indigo-400/30 bg-indigo-600 py-5 text-lg font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] disabled:cursor-not-allowed disabled:opacity-50">
                  {status === "loading" ?
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      {t("contactSending")}
                    </>
                  : <>
                      <Send className="h-5 w-5" />
                      {t("contactSendMessage")}
                    </>
                  }
                </button>
              </form>
            }
          </GlassCard>
        </div>

        <div className="mt-8 md:col-span-12">
          <div className="flex flex-wrap justify-center gap-8">
            <ContactOption
              icon={Mail}
              label={t("contactEmail")}
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

function ContactOption({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all group-hover:bg-white/10">
        <Icon className="h-6 w-6 text-indigo-400" />
      </div>
      <div>
        <h4 className="mb-1 text-xs leading-none font-bold tracking-widest text-white/40 uppercase">
          {label}
        </h4>
        <p className="font-medium text-white transition-colors group-hover:text-indigo-300">
          {value}
        </p>
      </div>
    </a>
  );
}
