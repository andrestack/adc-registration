"use client";

import { WorkshopPage } from "../components/workshop-page";

export default function DancePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Dance Workshop
        </h2>
        <p className="text-muted-foreground">
          List of participants registered for Dance workshop
        </p>
      </div>

      <WorkshopPage title="Dance Workshop Participants" workshopId="dance" />
    </div>
  );
}
