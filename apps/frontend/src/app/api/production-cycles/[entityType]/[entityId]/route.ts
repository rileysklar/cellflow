import { NextResponse } from 'next/server';
import type { ProductionCycle } from '@/services/productionService';
import { auth } from '@clerk/nextjs/server';

// Temporary mock data
const mockProductionCycles: ProductionCycle[] = [
  {
    id: '1',
    cell_id: 'default_cell_id',
    operator_id: 'op1',
    start_time: new Date(Date.now() - 3600000), // 1 hour ago
    end_time: new Date(Date.now() - 3540000),   // 59 minutes ago
    actual_cycle_time: 120,
    efficiency: 95,
    status: 'completed',
    notes: 'Regular production cycle'
  },
  {
    id: '2',
    cell_id: 'default_cell_id',
    operator_id: 'op1',
    start_time: new Date(Date.now() - 1800000), // 30 minutes ago
    end_time: new Date(Date.now() - 1740000),   // 29 minutes ago
    actual_cycle_time: 135,
    efficiency: 89,
    status: 'completed',
    notes: 'Slight delay in material feed'
  }
];

export async function GET(
  request: Request,
  { params }: { params: { entityType: string; entityId: string } }
) {
  try {
    // Ensure user is authenticated
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // In a real application, you would fetch this data from your database
    // For now, we'll return mock data
    return NextResponse.json(mockProductionCycles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch production cycles' },
      { status: 500 }
    );
  }
}

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