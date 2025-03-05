"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  Code,
  Database,
  Zap,
  ShieldCheck,
  Layers,
  Paintbrush,
  Server,
  LayoutGrid,
  Terminal
} from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FeatureProps {
  title: string
  description: string
  icon: React.ElementType
}

const features: FeatureProps[] = [
  {
    title: "Cursor IDE Optimized",
    description:
      "Built specifically for easy AI-assisted development with the Cursor editor.",
    icon: Terminal
  },
  {
    title: "Next.js Framework",
    description:
      "Leverages the power of Next.js App Router, server components, and client components.",
    icon: LayoutGrid
  },
  {
    title: "Type-Safe Database",
    description:
      "Supabase Postgres with Drizzle ORM for complete type safety from database to UI.",
    icon: Database
  },
  {
    title: "Authentication Ready",
    description:
      "Clerk authentication with social login support and ready-to-use components.",
    icon: ShieldCheck
  },
  {
    title: "UI Component Library",
    description:
      "Shadcn components, Tailwind CSS styling, and responsive design patterns.",
    icon: Paintbrush
  },
  {
    title: "Performance Focused",
    description:
      "Optimized for Core Web Vitals with server components and efficient rendering.",
    icon: Zap
  }
]

const FeatureCard = ({ title, description, icon: Icon }: FeatureProps) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-card flex flex-col items-center rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md"
  >
    <div className="bg-primary/10 mb-4 rounded-full p-3">
      <Icon className="text-primary size-6" />
    </div>
    <h3 className="mb-2 text-xl font-medium">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </motion.div>
)

export const FeaturesSection = () => {
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="container mx-auto -mt-8 px-4 py-8">
      {!mounted ? (
        // Placeholder while loading
        <>
          <div className="mb-6 text-center">
            <div className="bg-muted mx-auto mb-2 h-10 w-64 animate-pulse rounded-md"></div>
            <div className="bg-muted mx-auto h-6 w-96 animate-pulse rounded-md"></div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-muted h-40 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        </>
      ) : (
        // Actual content when mounted
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-center"
          >
            <h2
              className={cn(
                "mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              )}
            >
              Built for Modern Development
            </h2>
            <p className="text-muted-foreground mx-auto max-w-[800px] text-balance md:text-xl">
              A comprehensive stack that includes everything you need to build
              your next project quickly. Just clone, customize, and deploy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 flex flex-col items-center"
          >
            <Button asChild size="lg">
              <Link
                href="https://github.com/materialize-labs/ai-optimized-starter-app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Code className="mr-2 size-4" />
                View on GitHub
              </Link>
            </Button>
          </motion.div>
        </>
      )}
    </div>
  )
}
