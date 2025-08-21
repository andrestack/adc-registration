"use client";

import { WorkshopPage } from "../components/workshop-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DjembePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Djembe Workshop
        </h2>
        <p className="text-muted-foreground">
          List of participants registered for Djembe workshops
        </p>
      </div>

      <Tabs defaultValue="intermediate">
        <TabsList>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="intermediate">
          <WorkshopPage
            title="Djembe Intermediate"
            workshopId="djembe"
            level="intermediate"
          />
        </TabsContent>
        <TabsContent value="advanced">
          <WorkshopPage
            title="Djembe Advanced"
            workshopId="djembe"
            level="advanced"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
