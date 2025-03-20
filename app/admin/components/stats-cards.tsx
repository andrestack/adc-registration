import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Registration {
  workshops: Array<{
    id: string;
    level?: string;
  }>;
  total: number;
}

interface CardProps {
  data: Registration[];
}

export function StatsCards({ data }: CardProps) {
  // Calculate total registrations
  const totalRegistrations = data.length;

  // Count workshop participants
  const djembeIntermediate = data.filter((reg) =>
    reg.workshops.some((w) => w.id === "djembe" && w.level === "intermediate")
  ).length;

  const djembeAdvanced = data.filter((reg) =>
    reg.workshops.some((w) => w.id === "djembe" && w.level === "advanced")
  ).length;

  const danceParticipants = data.filter((reg) =>
    reg.workshops.some((w) => w.id === "dance")
  ).length;

  const balafonParticipants = data.filter((reg) =>
    reg.workshops.some((w) => w.id === "balafon")
  ).length;

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 5xl/main:grid-cols-4 grid grid-cols-4 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6 font-sans">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total de Inscrições</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-sans tabular-nums">
            {totalRegistrations}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card grid grid-cols-2 gap-4">
        <CardHeader className="relative">
          <CardDescription>Djembe I</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-sans tabular-nums">
            {djembeIntermediate}
          </CardTitle>
        </CardHeader>
        <CardHeader className="relative">
          <CardDescription>Djembe II</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-sans tabular-nums">
            {djembeAdvanced}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Dança</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-sans tabular-nums">
            {danceParticipants}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Balafon</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-sans tabular-nums">
            {balafonParticipants}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
