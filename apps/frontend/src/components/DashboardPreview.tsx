'use client';

import { ProductionCycle, Downtime, EfficiencyMetric } from '@/services/productionService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { calculateEfficiency } from '@/utils/calculations';

interface DashboardPreviewProps {
  productionCycles: ProductionCycle[];
  downtimes: Downtime[];
  efficiencyMetrics: EfficiencyMetric[];
  targetCycleTime?: number;
  targetEfficiency?: number;
}

export default function DashboardPreview({
  productionCycles,
  downtimes,
  efficiencyMetrics,
  targetCycleTime = 120, // Default target cycle time from data model
  targetEfficiency = 85, // Default target efficiency
}: DashboardPreviewProps) {
  // Calculate current efficiency
  const currentEfficiency = efficiencyMetrics.length > 0
    ? efficiencyMetrics[efficiencyMetrics.length - 1].efficiency
    : 0;

  // Calculate average cycle time
  const averageCycleTime = productionCycles.length > 0
    ? productionCycles.reduce((acc, cycle) => acc + cycle.actual_cycle_time, 0) / productionCycles.length
    : 0;

  // Calculate total downtime duration in minutes
  const totalDowntimeMinutes = downtimes.reduce((acc, downtime) => {
    const duration = (new Date(downtime.end_time).getTime() - new Date(downtime.start_time).getTime()) / (1000 * 60);
    return acc + duration;
  }, 0);

  // Calculate bottleneck status
  const isBottleneck = averageCycleTime > targetCycleTime * 1.2;

  // Group downtimes by reason
  const downtimesByReason = downtimes.reduce((acc, downtime) => {
    acc[downtime.reason] = (acc[downtime.reason] || 0) + 
      (new Date(downtime.end_time).getTime() - new Date(downtime.start_time).getTime()) / (1000 * 60);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Efficiency Metrics */}
      <Card className={`${currentEfficiency < targetEfficiency ? 'border-red-400' : 'border-green-400'}`}>
        <CardHeader>
          <CardTitle>Current Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currentEfficiency !== undefined ? `${currentEfficiency.toFixed(1)}%` : 'No data'}
          </div>
          <div className="text-sm text-gray-500">
            Target: {targetEfficiency}%
          </div>
        </CardContent>
      </Card>

      {/* Cycle Time Metrics */}
      <Card className={`${isBottleneck ? 'border-red-400' : 'border-green-400'}`}>
        <CardHeader>
          <CardTitle>Average Cycle Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageCycleTime ? `${averageCycleTime.toFixed(1)} sec` : 'No data'}
          </div>
          <div className="text-sm text-gray-500">
            Target: {targetCycleTime} sec
            {isBottleneck && <span className="text-red-500 ml-2">(Bottleneck)</span>}
          </div>
        </CardContent>
      </Card>

      {/* Production Volume */}
      <Card>
        <CardHeader>
          <CardTitle>Production Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {productionCycles.length || 'No data'}
          </div>
          <div className="text-sm text-gray-500">
            Total cycles completed
          </div>
        </CardContent>
      </Card>

      {/* Downtime Analysis */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Downtime Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              {totalDowntimeMinutes ? `${totalDowntimeMinutes.toFixed(0)} min` : 'No data'}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(downtimesByReason).map(([reason, minutes]) => (
                <div key={reason} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium capitalize">{reason.replace('_', ' ')}</div>
                  <div className="text-sm text-gray-500">{minutes.toFixed(0)} min</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Production Cycles */}
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Recent Production Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          {productionCycles.length > 0 ? (
            <div className="space-y-4">
              {productionCycles.slice(-5).map((cycle) => (
                <div
                  key={cycle.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">
                      Cycle Time: {cycle.actual_cycle_time}s
                      {cycle.actual_cycle_time > targetCycleTime && (
                        <span className="text-red-500 ml-2">(Above Target)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(cycle.start_time).toLocaleString()}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-sm ${
                    cycle.status === 'completed' ? 'bg-green-100 text-green-800' :
                    cycle.status === 'interrupted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {cycle.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No production cycles recorded</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 