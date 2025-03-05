import { NextResponse } from 'next/server';
import type { EfficiencyMetric } from '@/services/productionService';

// Generate realistic mock data for the last 8 hours with variations
function generateMockData(): EfficiencyMetric[] {
  const metrics: EfficiencyMetric[] = [];
  const now = new Date();
  const hoursToShow = 8;
  const pointsPerHour = 4; // 15-minute intervals

  for (let i = hoursToShow * pointsPerHour; i >= 0; i--) {
    // Create some realistic variations in efficiency
    const baseEfficiency = 85; // Target efficiency
    const variation = Math.sin(i * 0.5) * 10 + Math.random() * 5; // Sine wave + random noise
    const efficiency = Math.min(100, Math.max(60, baseEfficiency + variation)); // Keep between 60-100%

    // Create some realistic cycle time variations
    const baseCycleTime = 120; // Base cycle time in seconds
    const cycleTimeVariation = Math.random() * 20 - 10; // ±10 seconds variation
    const cycleTime = Math.max(90, baseCycleTime + cycleTimeVariation);

    const timestamp = new Date(now.getTime() - (i * 15 * 60 * 1000)); // 15-minute intervals

    metrics.push({
      id: i.toString(),
      entity_type: 'cell',
      entity_id: 'default_cell_id',
      timestamp,
      efficiency,
      cycle_time: Math.round(cycleTime),
      bottleneck_status: cycleTime > 130, // Bottleneck if cycle time > 130s
      created_at: timestamp
    });
  }

  return metrics;
}

// Cache the mock data for 15 minutes
let mockEfficiencyMetrics: EfficiencyMetric[] | null = null;
let lastGenerated: number = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function GET(
  request: Request,
  { params }: { params: { entityType: string; entityId: string } }
) {
  try {
    const now = Date.now();
    
    // Generate new data if cache expired or doesn't exist
    if (!mockEfficiencyMetrics || (now - lastGenerated) > CACHE_DURATION) {
      mockEfficiencyMetrics = generateMockData();
      lastGenerated = now;
    }

    // Add one new data point with slight variation from the last point
    const lastPoint = mockEfficiencyMetrics[mockEfficiencyMetrics.length - 1];
    const newEfficiency = Math.min(100, Math.max(60,
      lastPoint.efficiency + (Math.random() * 6 - 3) // ±3% variation
    ));
    const newCycleTime = Math.max(90,
      lastPoint.cycle_time + (Math.random() * 10 - 5) // ±5s variation
    );

    const newPoint: EfficiencyMetric = {
      id: (parseInt(lastPoint.id) + 1).toString(),
      entity_type: 'cell',
      entity_id: 'default_cell_id',
      timestamp: new Date(),
      efficiency: newEfficiency,
      cycle_time: Math.round(newCycleTime),
      bottleneck_status: newCycleTime > 130,
      created_at: new Date()
    };

    // Remove oldest point and add new point
    mockEfficiencyMetrics = [...mockEfficiencyMetrics.slice(1), newPoint];

    return NextResponse.json(mockEfficiencyMetrics);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch efficiency metrics' },
      { status: 500 }
    );
  }
} 