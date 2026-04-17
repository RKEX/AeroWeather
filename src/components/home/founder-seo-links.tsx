"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import Link from "next/link";

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
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] text-white/70">
        <Link href="/rick-das" className="underline decoration-white/40 underline-offset-2 hover:text-indigo-200">
          {t("homeLearnRickDasBn")}
        </Link>
        <Link href="/rick-das" className="underline decoration-white/40 underline-offset-2 hover:text-indigo-200">
          {t("homeLearnRickDasHi")}
        </Link>
      </div>
    </section>
  );
}
