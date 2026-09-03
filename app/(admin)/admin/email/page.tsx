"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/use-toast";
import {
  Participant,
  EmailApiResponse,
} from "@/app/(admin)/admin/email/types/email.types";
import {
  Mail,
  Send,
  UserCheck,
  Users,
  Search,
  CheckCircle2,
} from "lucide-react";

type RecipientMode = "all" | "individual";

async function getParticipants(year: number): Promise<Participant[]> {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/api/email?year=${year}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch participants");
  }

  const json: EmailApiResponse<Participant[]> = await res.json();
  return json.data || [];
}

async function sendEmail(payload: {
  subject: string;
  body: string;
  recipientEmails: string[];
}) {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/api/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json: EmailApiResponse = await res.json();
  return { ok: res.ok, json };
}

export default function EmailPage() {
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  const [recipientMode, setRecipientMode] =
    useState<RecipientMode>("individual");
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    getParticipants(2026)
      .then((data) => {
        setParticipants(data);
      })
      .catch((error) => {
        console.error("Failed to fetch participants:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os participantes.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoadingParticipants(false);
      });
  }, [toast]);

  const filteredParticipants = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return participants;
    return participants.filter(
      (p) =>
        p.fullName.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query)
    );
  }, [participants, search]);

  const allFilteredSelected = useMemo(() => {
    if (filteredParticipants.length === 0) return false;
    return filteredParticipants.every((p) => selectedEmails.has(p.email));
  }, [filteredParticipants, selectedEmails]);

  const selectedCount = useMemo(() => {
    if (recipientMode === "all") return participants.length;
    return selectedEmails.size;
  }, [recipientMode, participants.length, selectedEmails.size]);

  const toggleParticipant = (email: string) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) {
        next.delete(email);
      } else {
        next.add(email);
      }
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const recipientEmails =
      recipientMode === "all"
        ? participants.map((p) => p.email)
        : Array.from(selectedEmails);

    if (recipientEmails.length === 0) {
      toast({
        title: "Sem destinatários",
        description: "Seleciona pelo menos um destinatário.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setSendSuccess(false);
    const { ok, json } = await sendEmail({ subject, body, recipientEmails });
    setIsSending(false);

    if (ok) {
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 4000);
      toast({
        title: "Enviado",
        description: `Email colocado na fila para ${json.recipientCount} destinatário(s).`,
      });
      setSubject("");
      setBody("");
      setSelectedEmails(new Set());
    } else {
      toast({
        title: "Erro ao enviar",
        description:
          json.message || "Ocorreu um erro ao colocar o email na fila.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingParticipants) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-semibold font-garda-empty tracking-tight">
            Email
          </h2>
          <p className="text-muted-foreground">
            Enviar emails para os participantes do ADC 2026
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-muted-foreground">
            A carregar participantes...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold font-garda-empty tracking-tight">
          Email
        </h2>
        <p className="text-muted-foreground">
          Enviar emails para os participantes do ADC 2026
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Novo Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Informações importantes ADC 2026"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Mensagem</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Escreve aqui a mensagem. Podes usar HTML se quiseres formatação."
                required
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Podes utilizar HTML para formatar o email (negrito, listas,
                etc.). O n8n irá enviar o conteúdo exatamente como está.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Destinatários</Label>
              <RadioGroup
                value={recipientMode}
                onValueChange={(value) =>
                  setRecipientMode(value as RecipientMode)
                }
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value="all" id="all" />
                  <Label
                    htmlFor="all"
                    className="flex flex-1 cursor-pointer items-center gap-2 font-normal"
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Todos os participantes 2026
                    <span className="ml-auto text-xs text-muted-foreground">
                      {participants.length} email(s)
                    </span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label
                    htmlFor="individual"
                    className="flex flex-1 cursor-pointer items-center gap-2 font-normal"
                  >
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    Selecionar individualmente
                    {recipientMode === "individual" && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {selectedEmails.size} selecionado(s)
                      </span>
                    )}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {recipientMode === "individual" && (
              <div className="space-y-3 rounded-md border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Procurar por nome ou email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedEmails((prev) => {
                          const next = new Set(prev);
                          const shouldSelect =
                            filteredParticipants.length > 0 &&
                            !allFilteredSelected;
                          for (const participant of filteredParticipants) {
                            if (shouldSelect) {
                              next.add(participant.email);
                            } else {
                              next.delete(participant.email);
                            }
                          }
                          return next;
                        });
                      }}
                      disabled={filteredParticipants.length === 0}
                    >
                      {allFilteredSelected
                        ? "Limpar filtrados"
                        : "Selecionar filtrados"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedEmails(new Set())}
                      disabled={selectedEmails.size === 0}
                    >
                      Limpar tudo
                    </Button>
                  </div>
                </div>

                <div className="max-h-[320px] overflow-y-auto rounded-md border">
                  {filteredParticipants.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Nenhum participante encontrado.
                    </div>
                  ) : (
                    <ul className="divide-y">
                      {filteredParticipants.map((participant) => (
                        <li
                          key={participant._id}
                          className="flex items-center gap-3 p-3 hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`participant-${participant._id}`}
                            checked={selectedEmails.has(participant.email)}
                            onCheckedChange={() =>
                              toggleParticipant(participant.email)
                            }
                          />
                          <Label
                            htmlFor={`participant-${participant._id}`}
                            className="flex flex-1 cursor-pointer flex-col gap-0.5 font-normal"
                          >
                            <span className="text-sm font-medium">
                              {participant.fullName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {participant.email}
                            </span>
                          </Label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground">
                {selectedCount} destinatário(s) selecionado(s)
              </p>
              <Button
                type="submit"
                disabled={
                  isSending ||
                  sendSuccess ||
                  !subject.trim() ||
                  !body.trim() ||
                  selectedCount === 0
                }
                className={
                  sendSuccess
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : ""
                }
              >
                {isSending ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    A enviar...
                  </>
                ) : sendSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Enviado
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
