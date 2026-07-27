import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

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
  const totalRevenue = data.reduce((acc, reg) => acc + reg.total, 0);

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
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 5xl/main:grid-cols-4 grid grid-cols-5 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6 font-sans">
      <Card className="@container/card transition-colors hover:bg-muted/50">
        <CardHeader className="relative">
          <CardDescription>Total</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-3xl font-semibold tabular-nums">
           € {totalRevenue}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card transition-colors hover:bg-muted/50">
        <CardHeader className="relative">
          <CardDescription>Total de Participantes</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalRegistrations}
          </CardTitle>
        </CardHeader>
      </Card>
      <Link href="/admin/workshops/djembe">
        <Card className="@container/card grid grid-cols-2 gap-4 transition-colors hover:bg-muted/50">
          <CardHeader className="relative">
            <CardDescription>Djembe I</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {djembeIntermediate}
            </CardTitle>
          </CardHeader>
          <CardHeader className="relative">
            <CardDescription>Djembe II</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {djembeAdvanced}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
      <Link href="/admin/workshops/dance">
        <Card className="@container/card transition-colors hover:bg-muted/50">
          <CardHeader className="relative">
            <CardDescription>Dança</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {danceParticipants}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
      <Link href="/admin/workshops/balafon">
        <Card className="@container/card transition-colors hover:bg-muted/50">
          <CardHeader className="relative">
            <CardDescription>Balafon</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {balafonParticipants}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
}
