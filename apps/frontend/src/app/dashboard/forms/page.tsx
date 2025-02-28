import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MachineCycleForm } from "@/components/forms/machine-cycle-form"
import { DowntimeForm } from "@/components/forms/downtime-form"
import { SettingsForm } from "@/components/forms/settings-form"

export default function FormsPage() {
  return (
    <div className="space-y-6 max-w-screen-md mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Entry Forms</h1>
        <p className="text-muted-foreground">Log machine cycles, downtime events, and configure settings.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="machine-cycle" className="space-y-4">
            <TabsList>
              <TabsTrigger value="machine-cycle">Machine Cycle</TabsTrigger>
              <TabsTrigger value="downtime">Downtime</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="machine-cycle" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Machine Cycle Log</h2>
                <p className="text-sm text-muted-foreground">Record machine cycles and production data.</p>
              </div>
              <MachineCycleForm />
            </TabsContent>
            <TabsContent value="downtime" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Downtime Log</h2>
                <p className="text-sm text-muted-foreground">Record machine downtime events and issues.</p>
              </div>
              <DowntimeForm />
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Settings Configuration</h2>
                <p className="text-sm text-muted-foreground">Configure production settings and thresholds.</p>
              </div>
              <SettingsForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 