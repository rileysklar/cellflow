import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CellDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cell Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage individual cell performance metrics.</p>
      </div>

      {/* Cell Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last shift</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cycle Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45s</div>
            <p className="text-xs text-muted-foreground">Average over last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parts Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">Today's production</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Machine Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Running</div>
            <p className="text-xs text-muted-foreground">Last 4 hours uptime</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Hourly Performance</CardTitle>
            <CardDescription>Cell efficiency over the last 8 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              Performance Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Issues</CardTitle>
            <CardDescription>Last reported problems and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-600 mr-2"></span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Cycle Time Deviation</p>
                  <p className="text-xs text-muted-foreground">10:23 AM - Station 2</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-yellow-600 mr-2"></span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Material Low</p>
                  <p className="text-xs text-muted-foreground">9:45 AM - Feed System</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Maintenance Due</p>
                  <p className="text-xs text-muted-foreground">Scheduled for 2:00 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cell Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Cell Configuration</CardTitle>
          <CardDescription>Current cell settings and parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-medium">Target Cycle Time</p>
              <p className="text-2xl font-bold">42s</p>
            </div>
            <div>
              <p className="text-sm font-medium">Operators Assigned</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div>
              <p className="text-sm font-medium">Current Product</p>
              <p className="text-2xl font-bold">SKU-123</p>
            </div>
            <div>
              <p className="text-sm font-medium">Shift Pattern</p>
              <p className="text-2xl font-bold">A-Shift</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 