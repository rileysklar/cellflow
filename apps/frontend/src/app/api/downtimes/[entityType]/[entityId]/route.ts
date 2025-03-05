import { NextResponse } from 'next/server';
import type { Downtime } from '@/services/productionService';

// Temporary mock data
const mockDowntimes: Downtime[] = [
  {
    id: '1',
    cell_id: 'default_cell_id',
    operator_id: 'op1',
    start_time: new Date(Date.now() - 7200000), // 2 hours ago
    end_time: new Date(Date.now() - 5400000),   // 1.5 hours ago
    reason: 'maintenance',
    description: 'Scheduled maintenance'
  },
  {
    id: '2',
    cell_id: 'default_cell_id',
    operator_id: 'op1',
    start_time: new Date(Date.now() - 3600000), // 1 hour ago
    end_time: new Date(Date.now() - 3300000),   // 55 minutes ago
    reason: 'material_shortage',
    description: 'Waiting for material delivery'
  }
];

export async function GET(
  request: Request,
  { params }: { params: { entityType: string; entityId: string } }
) {
  try {
    // In a real application, you would fetch this data from your database
    // For now, we'll return mock data
    return NextResponse.json(mockDowntimes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch downtimes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real application, you would save this to your database
    // For now, we'll just return the data with a mock ID
    const newDowntime: Downtime = {
      id: Date.now().toString(),
      ...body,
    };

    return NextResponse.json(newDowntime);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create downtime' },
      { status: 500 }
    );
  }
} 