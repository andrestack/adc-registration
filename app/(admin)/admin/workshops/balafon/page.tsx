"use client";

import { WorkshopPage } from "../components/workshop-page";

export default function BalafonPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Workshop de Balafon 2026
        </h2>
        <p className="text-muted-foreground">
          Lista de participantes inscritos no workshop de Balafon - ADC 2026
        </p>
      </div>

      <WorkshopPage
        title="Participantes do Workshop de Balafon"
        workshopId="balafon"
      />
    </div>
  );
}
