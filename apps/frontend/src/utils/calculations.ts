/**
 * Calculates efficiency based on standard cycle time and actual cycle time
 * Formula: (standard_cycle_time / actual_cycle_time) * 100
 */
export const calculateEfficiency = (standardCycleTime: number, actualCycleTime: number): number => {
  if (actualCycleTime <= 0) return 0;
  return (standardCycleTime / actualCycleTime) * 100;
};

/**
 * Determines if a cell is a bottleneck based on actual cycle time
 * A cell is considered a bottleneck if actual_cycle_time > target_cycle_time * 1.2
 */
export const isBottleneck = (targetCycleTime: number, actualCycleTime: number): boolean => {
  return actualCycleTime > targetCycleTime * 1.2;
};

/**
 * Calculates average efficiency for a collection of metrics
 */
export const calculateAverageEfficiency = (efficiencies: number[]): number => {
  if (efficiencies.length === 0) return 0;
  return efficiencies.reduce((sum, efficiency) => sum + efficiency, 0) / efficiencies.length;
};

/**
 * Formats duration in milliseconds to minutes
 */
export const msToMinutes = (ms: number): number => {
  return ms / (1000 * 60);
};

/**
 * Calculates downtime duration in minutes between two timestamps
 */
export const calculateDowntimeDuration = (startTime: Date | string, endTime: Date | string): number => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return msToMinutes(end - start);
}; 