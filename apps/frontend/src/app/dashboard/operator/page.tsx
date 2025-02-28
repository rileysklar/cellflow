import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OperatorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Operator Dashboard</h1>
        <p className="text-muted-foreground">Individual operator performance and task management.</p>
      </div>

      {/* Operator Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Based on last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Cell</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Cell-A4</div>
            <p className="text-xs text-muted-foreground">Assembly Line 2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shift Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">On Duty</div>
            <p className="text-xs text-muted-foreground">Started at 6:00 AM</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Daily Performance Trend</CardTitle>
            <CardDescription>Efficiency metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              Performance Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Current Tasks</CardTitle>
            <CardDescription>Assigned work and priorities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-600 mr-2"></span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Quality Check</p>
                  <p className="text-xs text-muted-foreground">Due in 30 minutes</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-yellow-600 mr-2"></span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Material Resupply</p>
                  <p className="text-xs text-muted-foreground">Scheduled for 2:30 PM</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Training Session</p>
                  <p className="text-xs text-muted-foreground">Tomorrow at 9:00 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills and Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Certifications</CardTitle>
          <CardDescription>Current qualifications and training status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-medium">Safety Training</p>
              <p className="text-2xl font-bold text-green-600">Current</p>
              <p className="text-xs text-muted-foreground">Valid until Dec 2024</p>
            </div>
            <div>
              <p className="text-sm font-medium">Quality Control</p>
              <p className="text-2xl font-bold text-green-600">Certified</p>
              <p className="text-xs text-muted-foreground">Level 2 Inspector</p>
            </div>
            <div>
              <p className="text-sm font-medium">Machine Operation</p>
              <p className="text-2xl font-bold text-yellow-600">In Training</p>
              <p className="text-xs text-muted-foreground">Advanced Level</p>
            </div>
            <div>
              <p className="text-sm font-medium">Process Improvement</p>
              <p className="text-2xl font-bold text-blue-600">Contributor</p>
              <p className="text-xs text-muted-foreground">5 Suggestions Made</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 