"use client";

import React from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { StatsCards } from "./components/stats-cards";

async function getRegistrations() {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${baseUrl}/api/registration`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch registrations");
  }

  const data = await res.json();
  console.log(data);
  return data.data;
}

export default function AdminPage() {
  const [registrations, setRegistrations] = React.useState([]);

  React.useEffect(() => {
    getRegistrations()
      .then((data) => {
        setRegistrations(data);
      })
      .catch((error) => {
        console.error("Failed to fetch registrations:", error);
      });
  }, []);

  return (
    <>  
    <div className="py-10">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-semibold font-garda-empty tracking-tight">
            Inscrições
          </h2>
          <p className="text-muted-foreground">
            Inscrições e pagamentos para o ADC 2025
          </p>
        </div>

        <StatsCards data={registrations} />

        <div className="rounded-lg border shadow p-4">
          <DataTable columns={columns} data={registrations} />
        </div>
      </div>
    </div>
    </>
  );
}
