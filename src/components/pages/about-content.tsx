"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { Link } from "@/navigation";
import type { LucideIcon } from "lucide-react";
import { Cloud, Compass, Eye, FileText, Rocket } from "lucide-react";

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
        <h2 className="text-xl font-bold text-white mb-6 text-center">{t("aboutProducts")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
            icon={Cloud}
            title="AeroWeather"
            desc={t("aboutAeroWeatherDesc")}
          />
          <InfoCard
            icon={FileText}
            title="Aerofilyx PDF Editor"
            desc={t("aboutPdfEditorDesc")}
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

      <section className="mb-6">
        <div className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-400" />
            {t("aboutUpcomingProjects")}
          </h2>
          <p className={`${textSecondary} text-sm leading-relaxed`}>
            {t("aboutGameSaveSync1")}
          </p>
          <p className={`${textSecondary} text-sm leading-relaxed mt-3`}>
            {t("aboutGameSaveSync2")}
          </p>
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
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <Icon className="w-5 h-5 text-indigo-400 mb-2" />
      <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
      <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}
