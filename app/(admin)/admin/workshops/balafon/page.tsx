"use client";

import { WorkshopPage } from "../components/workshop-page";

export default function BalafonPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Balafon Workshop 2026
        </h2>
        <p className="text-muted-foreground">
          List of participants registered for Balafon workshop - ADC 2026
        </p>
      </div>

      <WorkshopPage
        title="Balafon Workshop Participants"
        workshopId="balafon"
      />
    </div>
  );
}
