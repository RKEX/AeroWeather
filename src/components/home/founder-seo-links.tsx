"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import { Link } from "@/navigation";

export function FounderSeoLinks() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-2">
      <p className="text-center text-xs text-white/60">
        {t("homeFoundedBy")} {" "}
        <Link href="/rick-das" className="text-indigo-300 underline hover:text-indigo-200">
          Rick Das
        </Link>
      </p>
    </section>
  );
}
