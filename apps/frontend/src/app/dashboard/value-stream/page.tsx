import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ValueStreamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Value Streams</h2>
        <p className="text-muted-foreground">
          Monitor and optimize value stream performance across your facility
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Assembly Line A */}
        <Card>
          <CardHeader>
            <CardTitle>Assembly Line A</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Efficiency</span>
                <div className="flex items-center">
                  <span className="font-bold">92%</span>
                  <span className="text-green-600 ml-2">↑</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cycle Time</span>
                <span className="font-bold">45s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Cells</span>
                <span className="font-bold">5/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bottlenecks</span>
                <span className="font-bold text-green-600">None</span>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Recent Issues</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>No recent issues reported</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assembly Line B */}
        <Card>
          <CardHeader>
            <CardTitle>Assembly Line B</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Efficiency</span>
                <div className="flex items-center">
                  <span className="font-bold">78%</span>
                  <span className="text-red-600 ml-2">↓</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cycle Time</span>
                <span className="font-bold">52s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Cells</span>
                <span className="font-bold">4/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bottlenecks</span>
                <span className="font-bold text-red-600">2 detected</span>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Recent Issues</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Cell B3 efficiency below threshold</p>
                  <p>• Machine B2 maintenance required</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packaging */}
        <Card>
          <CardHeader>
            <CardTitle>Packaging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Efficiency</span>
                <div className="flex items-center">
                  <span className="font-bold">85%</span>
                  <span className="text-green-600 ml-2">↑</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cycle Time</span>
                <span className="font-bold">38s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Cells</span>
                <span className="font-bold">3/3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bottlenecks</span>
                <span className="font-bold text-yellow-600">1 potential</span>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Recent Issues</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Minor delay in material flow</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Chart component will be implemented here to show historical performance data
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 