import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview Dashboard</h1>
        <p className="text-muted-foreground">
          Manufacturing efficiency metrics and key performance indicators
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Overall Efficiency
            </p>
            <p className="text-2xl font-bold">85%</p>
            <div className="flex items-center text-sm text-green-600">
              <span>↑ 2.5%</span>
              <span className="text-muted-foreground ml-1">vs last week</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Active Cells
            </p>
            <p className="text-2xl font-bold">12/15</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>3 cells inactive</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Bottleneck Areas
            </p>
            <p className="text-2xl font-bold">2</p>
            <div className="flex items-center text-sm text-red-600">
              <span>↑ 1</span>
              <span className="text-muted-foreground ml-1">vs yesterday</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Average Cycle Time
            </p>
            <p className="text-2xl font-bold">45s</p>
            <div className="flex items-center text-sm text-green-600">
              <span>↓ 3s</span>
              <span className="text-muted-foreground ml-1">vs target</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Value Stream Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Assembly Line A</span>
              <div className="flex items-center">
                <span className="font-medium">92%</span>
                <span className="text-green-600 ml-2">↑</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Assembly Line B</span>
              <div className="flex items-center">
                <span className="font-medium">78%</span>
                <span className="text-red-600 ml-2">↓</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Packaging</span>
              <div className="flex items-center">
                <span className="font-medium">85%</span>
                <span className="text-green-600 ml-2">↑</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
              <span>Cell B3 efficiency dropped below 70%</span>
              <span className="ml-auto text-muted-foreground">2m ago</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
              <span>Maintenance due for Machine A2</span>
              <span className="ml-auto text-muted-foreground">15m ago</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <span>Value Stream C achieved target efficiency</span>
              <span className="ml-auto text-muted-foreground">1h ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 