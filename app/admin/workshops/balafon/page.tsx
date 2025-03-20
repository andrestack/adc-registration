"use client";

import { WorkshopPage } from "../components/workshop-page";

export default function BalafonPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Balafon Workshop
        </h2>
        <p className="text-muted-foreground">
          List of participants registered for Balafon workshop
        </p>
      </div>

      <WorkshopPage
        title="Balafon Workshop Participants"
        workshopId="balafon"
      />
    </div>
  );
}
