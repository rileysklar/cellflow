import { NextResponse } from 'next/server';
import type { EfficiencyMetric } from '@/services/productionService';

// Temporary mock data
const mockEfficiencyMetrics: EfficiencyMetric[] = [
  {
    id: '1',
    entity_type: 'cell',
    entity_id: 'default_cell_id',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    efficiency: 92.5,
    cycle_time: 125,
    bottleneck_status: false
  },
  {
    id: '2',
    entity_type: 'cell',
    entity_id: 'default_cell_id',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    efficiency: 88.3,
    cycle_time: 130,
    bottleneck_status: true
  },
  {
    id: '3',
    entity_type: 'cell',
    entity_id: 'default_cell_id',
    timestamp: new Date(), // current time
    efficiency: 95.2,
    cycle_time: 122,
    bottleneck_status: false
  }
];

export async function GET(
  request: Request,
  { params }: { params: { entityType: string; entityId: string } }
) {
  try {
    // In a real application, you would fetch this data from your database
    // For now, we'll return mock data
    return NextResponse.json(mockEfficiencyMetrics);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch efficiency metrics' },
      { status: 500 }
    );
  }
} 