import { UserButton } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Welcome to METS</h2>
          <p className="text-muted-foreground">
            Track and optimize your manufacturing efficiency
          </p>
        </Card>
      </div>
    </div>
  );
} 