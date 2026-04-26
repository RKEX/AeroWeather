"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import GlassCard from "@/components/ui/GlassCard";
import { Link } from "@/navigation";
import { Database, LucideIcon, Mail, MapPin, Share2, Shield } from "lucide-react";

export default function PrivacyContent() {
  const { t } = useLanguage();
  const textSecondary = "text-white/70";

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-8">
        <GlassCard
          as="a"
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/15"
        >
          ← {t("backToHome")}
        </GlassCard>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("privacyTitle")}</h1>
        <p className={`${textSecondary} text-lg`}>{t("privacySubtitle")}</p>
      </div>

      <div className="flex flex-col gap-8">
        <PrivacySection
          icon={Shield}
          title={t("privacyIntroductionTitle")}
          content={t("privacyIntroductionContent")}
        />
        <PrivacySection
          icon={MapPin}
          title={t("privacyLocationTitle")}
          content={t("privacyLocationContent")}
        />
        <PrivacySection
          icon={Database}
          title={t("privacyStorageTitle")}
          content={t("privacyStorageContent")}
        />
        <PrivacySection
          icon={Share2}
          title={t("privacyThirdPartyTitle")}
          content={t("privacyThirdPartyContent")}
        />
        <PrivacySection
          icon={Shield}
          title={t("privacyDataRightsTitle")}
          content={t("privacyDataRightsContent")}
        />
        <PrivacySection
          icon={Database}
          title={t("privacyCookiesTitle")}
          content={t("privacyCookiesContent")}
        />

        <GlassCard className="p-8 text-center mt-8">
          <h2 className="text-xl font-bold text-white mb-4">{t("privacyQuestionsTitle")}</h2>
          <p className={`${textSecondary} mb-6`}>{t("privacyQuestionsBody")}</p>
          <a
            href="mailto:rickd7587@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-indigo-600 border border-indigo-400/30 text-white font-bold transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            <Mail className="w-5 h-5" />
            {t("footerContactUs")}
          </a>
        </GlassCard>
      </div>
    </main>
  );
}

function PrivacySection({ icon: Icon, title, content }: { icon: LucideIcon; title: string; content: string }) {
  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex gap-6">
        <GlassCard className="shrink-0 w-12 h-12 flex items-center justify-center shadow-none">
          <Icon className="w-6 h-6 text-indigo-400" />
        </GlassCard>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-white/60 leading-relaxed">{content}</p>
        </div>
      </div>
    </GlassCard>
  );
}
