import { NextResponse } from 'next/server';
import type { ProductionCycle } from '@/services/productionService';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    // Ensure user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    
    // In a real application, you would save this to your database
    // For now, we'll just return the data with a mock ID
    const newCycle: ProductionCycle = {
      id: Date.now().toString(),
      ...body,
      efficiency: calculateEfficiency(body.actual_cycle_time)
    };

    return NextResponse.json(newCycle);
  } catch (error) {
    console.error('Error creating production cycle:', error);
    return NextResponse.json(
      { error: 'Failed to create production cycle' },
      { status: 500 }
    );
  }
}

// Helper function to calculate efficiency
function calculateEfficiency(actualCycleTime: number): number {
  // This is a simplified calculation. In a real application,
  // you would likely compare against a standard cycle time from your database
  const standardCycleTime = 120; // Example: 120 seconds is the standard
  return Math.round((standardCycleTime / actualCycleTime) * 100);
} 