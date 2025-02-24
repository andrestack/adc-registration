import { Metadata } from "next";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";

export const metadata: Metadata = {
  title: "Admin Dashboard - ADC Registration",
  description: "View and manage ADC workshop registrations",
};

async function getRegistrations() {
  // Determine the base URL based on the environment
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
  return data.data;
}

export default async function AdminPage() {
  const registrations = await getRegistrations();

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
          <p className="text-muted-foreground">
            View and manage workshop registrations
          </p>
        </div>
        <DataTable columns={columns} data={registrations} />
      </div>
    </div>
  );
}
