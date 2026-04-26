"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { Link } from "@/navigation";
import type { LucideIcon } from "lucide-react";
import { Activity, Compass, Database, Eye, ShieldCheck, Sparkles } from "lucide-react";

export default function AboutContent() {
  const { t } = useLanguage();
  const textSecondary = "text-white/70";

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80"
        >
          {t("back")}
        </Link>
      </div>

      <section className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t("aboutTitle")}
        </h1>
        <p className={`${textSecondary} text-sm leading-relaxed max-w-2xl mx-auto`}>
          {t("aboutIntro")}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6 text-center">
          {t("aboutMissionVision")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={Compass}
            title={t("aboutMissionTitle")}
            desc={t("aboutMissionDesc")}
          />
          <InfoCard
            icon={Eye}
            title={t("aboutVisionTitle")}
            desc={t("aboutVisionDesc")}
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6 text-center">{t("aboutKeyPillars")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={Sparkles}
            title={t("aboutAiTitle")}
            desc={t("aboutAiDesc")}
          />
          <InfoCard
            icon={Activity}
            title={t("aboutRadarTitle")}
            desc={t("aboutRadarDesc")}
          />
          <InfoCard
            icon={Database}
            title={t("aboutDataSourcingTitle")}
            desc={t("aboutDataSourcingDesc")}
          />
          <InfoCard
            icon={ShieldCheck}
            title={t("aboutPrivacyTitle")}
            desc={t("aboutPrivacyDesc")}
          />
        </div>
      </section>

      <section className="mb-12">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
          <h2 className="text-xl font-bold text-white mb-3">{t("aboutFounderTitle")}</h2>
          <p className={`${textSecondary} text-sm mb-3`}>{t("aboutFoundedByRick")}</p>
          <Link
            href="/rick-das"
            className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-300 hover:text-indigo-200 transition-colors"
          >
            {t("aboutLearnRick")}
          </Link>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <Icon className="w-6 h-6 text-indigo-400 mb-3" />
      <h3 className="text-white font-bold text-base mb-2">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
