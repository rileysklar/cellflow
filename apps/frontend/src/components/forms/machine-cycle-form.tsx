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

const formSchema = z.object({
  machineId: z.string({
    required_error: "Please select a machine.",
  }),
  cycleTime: z.number({
    required_error: "Cycle time is required.",
  }).min(1, "Cycle time must be greater than 0"),
  partsCompleted: z.number({
    required_error: "Number of parts completed is required.",
  }).min(0, "Parts completed must be 0 or greater"),
  operatorNotes: z.string().optional(),
})

export function MachineCycleForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operatorNotes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Submit to API
    toast({
      title: "Cycle logged successfully",
      description: `Machine ${values.machineId} completed ${values.partsCompleted} parts in ${values.cycleTime} seconds.`,
    })
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                Select the machine for this cycle log.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cycleTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cycle Time (seconds)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Enter the time taken to complete this cycle.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="partsCompleted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parts Completed</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Enter the number of parts completed in this cycle.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="operatorNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Add any relevant notes about this cycle (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Log Cycle</Button>
      </form>
    </Form>
  )
} 