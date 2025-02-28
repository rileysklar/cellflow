"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  machineId: z.string({
    required_error: "Please select a machine.",
  }),
  settings: z.object({
    targetCycleTime: z.number({
      required_error: "Target cycle time is required.",
    }).min(1, "Target cycle time must be greater than 0"),
    efficiencyThreshold: z.number({
      required_error: "Efficiency threshold is required.",
    }).min(0, "Threshold must be 0 or greater").max(100, "Threshold must be 100 or less"),
    downtimeThreshold: z.number({
      required_error: "Downtime threshold is required.",
    }).min(1, "Threshold must be greater than 0"),
    alertEmailAddresses: z.string().email("Invalid email format").array().optional(),
    shiftDuration: z.number({
      required_error: "Shift duration is required.",
    }).min(1, "Shift duration must be greater than 0"),
  })
})

export function SettingsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      settings: {
        targetCycleTime: 45,
        efficiencyThreshold: 85,
        downtimeThreshold: 15,
        shiftDuration: 480, // 8 hours in minutes
      }
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Submit to API
    toast({
      title: "Machine settings updated",
      description: `Settings for Machine ${values.machineId} have been updated.`,
    })
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Machine Selection</CardTitle>
            <CardDescription>Select the machine to configure settings for.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="machineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a machine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="machine-1">Machine 1</SelectItem>
                      <SelectItem value="machine-2">Machine 2</SelectItem>
                      <SelectItem value="machine-3">Machine 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the machine you want to configure settings for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Machine Settings</CardTitle>
            <CardDescription>Configure performance thresholds and operational parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="settings.targetCycleTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Cycle Time (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The target time to complete one production cycle.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="settings.efficiencyThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Efficiency Threshold (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The minimum acceptable efficiency percentage.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="settings.downtimeThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Downtime Threshold (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The maximum acceptable downtime before alerts are triggered.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="settings.shiftDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shift Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The duration of a standard production shift.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit">Save Machine Settings</Button>
        </div>
      </form>
    </Form>
  )
} 