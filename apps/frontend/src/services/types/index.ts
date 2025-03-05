export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ValueStream extends BaseEntity {
  name: string;
  description?: string;
  target_efficiency: number;
}

export interface Cell extends BaseEntity {
  name: string;
  value_stream_id: string;
  target_cycle_time: number;
  target_efficiency: number;
}

export interface ProductionCycle extends BaseEntity {
  cell_id: string;
  actual_cycle_time: number;
  target_cycle_time: number;
  efficiency: number;
  operator_id: string;
}

export interface Downtime extends BaseEntity {
  cell_id: string;
  start_time: Date;
  end_time: Date;
  reason: string;
  duration: number;
}

export interface EfficiencyMetric extends BaseEntity {
  entity_type: 'cell' | 'value_stream' | 'site';
  entity_id: string;
  timestamp: Date;
  efficiency: number;
  cycle_time: number;
  bottleneck_status: boolean;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
  };
} 