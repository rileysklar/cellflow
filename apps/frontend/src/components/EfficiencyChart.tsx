import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EfficiencyMetric } from '@/services/productionService';

interface EfficiencyChartProps {
  data: EfficiencyMetric[];
  targetEfficiency?: number;
}

const EfficiencyChart = ({ data, targetEfficiency = 85 }: EfficiencyChartProps) => {
  // Process data for the chart
  const chartData = data.map(metric => ({
    time: new Date(metric.timestamp).toLocaleTimeString(),
    efficiency: metric.efficiency,
    target: targetEfficiency,
    cycleTime: metric.cycle_time
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Efficiency Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Efficiency']}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#8884d8"
                fill="none"
                strokeDasharray="5 5"
                name="Target"
              />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
                name="Actual"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EfficiencyChart; 