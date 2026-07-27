"use client";

import { WorkshopPage } from "../components/workshop-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DjembePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Workshop de Djembe 2026
        </h2>
        <p className="text-muted-foreground">
          Lista de participantes inscritos nos workshops de Djembe - ADC 2026
        </p>
      </div>

      <Tabs defaultValue="intermediate">
        <TabsList>
          <TabsTrigger value="intermediate">Intermédio</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>
        <TabsContent value="intermediate">
          <WorkshopPage
            title="Djembe Intermédio"
            workshopId="djembe"
            level="intermediate"
          />
        </TabsContent>
        <TabsContent value="advanced">
          <WorkshopPage
            title="Djembe Avançado"
            workshopId="djembe"
            level="advanced"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
