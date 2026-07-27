"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export default function IbanPage() {
  const t = useTranslations("iban");
  const [iban, setIban] = useState("");
  const [ibanCopied, setIbanCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIban = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/get-iban");
        const data = await response.json();
        setIban(data.iban);
      } catch {
        toast({
          title: t("errorTitle"),
          description: t("loadFailed"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchIban();
  }, [toast, t]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIbanCopied(true);
      toast({
        title: t("copiedTitle"),
        description: t("copiedDescription"),
      });
      setTimeout(() => setIbanCopied(false), 2000);
    } catch {
      toast({
        title: t("errorTitle"),
        description: t("copyFailed"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t("title")}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">{t("subtitle")}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">{t("loading")}</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      IBAN:
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-lg font-semibold text-gray-900 break-all">
                        {iban}
                      </p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(iban)}
                              className="ml-2 flex-shrink-0"
                            >
                              {ibanCopied ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{ibanCopied ? t("copiedTitle") : t("copyIban")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">{t("nameLabel")}</span>{" "}
                      Carlos André Silva
                    </p>
                    <p>
                      <span className="font-medium">{t("bankLabel")}</span> N26
                    </p>
                    <p>
                      <span className="font-medium">BIC:</span> NTSBDEB1XXX
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {t("referenceLabel")}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {t("yourName")} + ADC2026
                  </p>
                  <p className="text-xs text-gray-600 mt-1 italic">
                    {t("referenceReminder")}
                  </p>
                </div>

                <Button
                  onClick={() => copyToClipboard(iban)}
                  className="w-full"
                  size="lg"
                >
                  {ibanCopied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      {t("copiedTitle")}
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      {t("copyIban")}
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            ADC - Aldeia da Cultura
            <br />
            {t("moreInfo")}
          </p>
        </div>
      </div>
    </div>
  );
}
