"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className="flex items-center gap-1 rounded-md border bg-white/80 p-1"
      aria-label={t("label")}
    >
      <Languages className="h-4 w-4 ml-1 text-muted-foreground" />
      {(["pt", "en"] as const).map((l) => (
        <Button
          key={l}
          asChild
          variant={locale === l ? "default" : "ghost"}
          size="sm"
          className="uppercase px-2"
        >
          <Link href={pathname} locale={l}>
            {l}
          </Link>
        </Button>
      ))}
    </div>
  );
}
