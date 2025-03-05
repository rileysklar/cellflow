import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-6 text-4xl font-bold">Manufacturing Efficiency Tracking System</h1>
      <p className="mb-8 text-lg text-muted-foreground text-center max-w-2xl">
        Track and optimize your manufacturing processes with real-time efficiency monitoring
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
