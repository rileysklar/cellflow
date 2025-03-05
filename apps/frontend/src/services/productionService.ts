import { create } from 'zustand';
import { StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { ApiService } from './base/ApiService';
import { ApiResponse } from './types';

// Types based on our data model
export interface Cell {
  id: string;
  value_stream_id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  target_cycle_time: number;
}

export interface ValueStream {
  id: string;
  site_id: string;
  name: string;
  description: string;
  target_efficiency: number;
}

export interface ProductionCycle {
  id: string;
  cell_id: string;
  operator_id: string;
  start_time: Date;
  end_time: Date;
  actual_cycle_time: number;
  target_cycle_time: number;
  efficiency: number;
  status: 'completed' | 'interrupted' | 'error';
  notes: string;
}

export interface Downtime {
  id: string;
  cell_id: string;
  operator_id: string;
  start_time: Date;
  end_time: Date;
  reason: 'maintenance' | 'setup' | 'breakdown' | 'material_shortage';
  description: string;
}

export interface EfficiencyMetric {
  id: string;
  entity_type: 'cell' | 'value_stream' | 'site' | 'company';
  entity_id: string;
  timestamp: Date;
  efficiency: number;
  cycle_time: number;
  bottleneck_status: boolean;
  created_at: Date;
}

interface FormData {
  timestamp: string;
  duration_minutes: number;
  actual_cycle_time: number;
  status: 'completed' | 'interrupted' | 'error';
  notes: string;
  value_stream_id: string;
  cell_id: string;
}

interface ProductionState {
  productionCycles: ProductionCycle[];
  downtimes: Downtime[];
  efficiencyMetrics: EfficiencyMetric[];
  valueStreams: ValueStream[];
  cells: Cell[];
  isLoading: boolean;
  error: string | null;
  formData: FormData | null;
  
  // Actions
  addProductionCycle: (cycle: Omit<ProductionCycle, 'id'>) => Promise<void>;
  addDowntime: (downtime: Omit<Downtime, 'id'>) => Promise<void>;
  updateEfficiencyMetrics: (entityId: string, entityType: EfficiencyMetric['entity_type']) => Promise<void>;
  fetchDashboardData: (entityId: string, entityType: EfficiencyMetric['entity_type']) => Promise<void>;
  fetchValueStreams: () => Promise<void>;
  fetchCellsByValueStream: (valueStreamId: string) => Promise<void>;
  getCell: (cellId: string) => Cell | undefined;
  setFormData: (data: FormData) => void;
}

// Calculate efficiency based on standard and actual cycle times
const calculateEfficiency = (standardTime: number, actualTime: number): number => {
  return (standardTime / actualTime) * 100;
};

interface PersistedState {
  valueStreams: ValueStream[];
  cells: Cell[];
  productionCycles: ProductionCycle[];
  downtimes: Downtime[];
  efficiencyMetrics: EfficiencyMetric[];
}

// Create the store with persistence
export const useProductionStore = create<ProductionState>()(
  persist(
    (set, get) => ({
      productionCycles: [],
      downtimes: [],
      efficiencyMetrics: [],
      valueStreams: [],
      cells: [],
      isLoading: false,
      error: null,
      formData: null,

      setFormData: (data: FormData) => {
        set({ formData: data });
      },

      addProductionCycle: async (cycle: Omit<ProductionCycle, 'id'>) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch('/api/production-cycles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cycle),
          });

          if (!response.ok) throw new Error('Failed to add production cycle');

          const newCycle = await response.json();
          set((state) => ({
            productionCycles: [...state.productionCycles, newCycle],
          }));

          await get().updateEfficiencyMetrics(cycle.cell_id, 'cell');
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchValueStreams: async () => {
        const currentState = get();
        // Don't fetch if we already have value streams
        if (currentState.valueStreams.length > 0) {
          console.log('Using cached value streams:', currentState.valueStreams);
          return;
        }

        try {
          set({ isLoading: true, error: null });
          console.log('Fetching value streams from API...');
          const response = await fetch('/api/value-streams');
          if (!response.ok) throw new Error('Failed to fetch value streams');
          
          const valueStreams = await response.json();
          console.log('Setting value streams in store:', valueStreams);
          set({ valueStreams });
        } catch (error) {
          console.error('Error fetching value streams:', error);
          set({ error: error instanceof Error ? error.message : 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchCellsByValueStream: async (valueStreamId: string) => {
        try {
          set({ isLoading: true, error: null });
          console.log('Fetching cells for value stream:', valueStreamId);
          const response = await fetch(`/api/cells?valueStreamId=${valueStreamId}`);
          if (!response.ok) throw new Error('Failed to fetch cells');
          
          const cells = await response.json();
          console.log('Setting cells in store:', cells);
          set({ cells });
        } catch (error) {
          console.error('Error fetching cells:', error);
          set({ error: error instanceof Error ? error.message : 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      getCell: (cellId: string) => {
        return get().cells.find(cell => cell.id === cellId);
      },

      addDowntime: async (downtime: Omit<Downtime, 'id'>) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Replace with actual API call
          const response = await fetch('/api/downtimes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(downtime),
          });

          if (!response.ok) throw new Error('Failed to add downtime');

          const newDowntime = await response.json();
          set((state: ProductionState) => ({
            downtimes: [...state.downtimes, newDowntime],
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateEfficiencyMetrics: async (entityId: string, entityType: EfficiencyMetric['entity_type']) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch(`/api/efficiency-metrics/${entityType}/${entityId}`);
          if (!response.ok) throw new Error('Failed to update efficiency metrics');

          const metrics = await response.json();
          set({ efficiencyMetrics: metrics });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchDashboardData: async (entityId: string, entityType: EfficiencyMetric['entity_type']) => {
        try {
          set({ isLoading: true, error: null });
          
          // TODO: Replace with actual API calls
          const [cyclesRes, downtimesRes, metricsRes] = await Promise.all([
            fetch(`/api/production-cycles/${entityType}/${entityId}`),
            fetch(`/api/downtimes/${entityType}/${entityId}`),
            fetch(`/api/efficiency-metrics/${entityType}/${entityId}`),
          ]);

          const [cycles, downtimes, metrics] = await Promise.all([
            cyclesRes.json(),
            downtimesRes.json(),
            metricsRes.json(),
          ]);

          set({
            productionCycles: cycles,
            downtimes: downtimes,
            efficiencyMetrics: metrics,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'An error occurred' });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'production-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        valueStreams: state.valueStreams,
        cells: state.cells,
        productionCycles: state.productionCycles,
        downtimes: state.downtimes,
        efficiencyMetrics: state.efficiencyMetrics
      })
    } as PersistOptions<ProductionState, PersistedState>
  )
);

export class ProductionService extends ApiService {
  // Value Streams
  async getValueStreams(): Promise<ApiResponse<ValueStream[]>> {
    return this.get<ValueStream[]>('/value-streams');
  }

  // Cells
  async getCells(valueStreamId: string): Promise<ApiResponse<Cell[]>> {
    return this.get<Cell[]>(`/value-streams/${valueStreamId}/cells`);
  }

  async getCell(cellId: string): Promise<ApiResponse<Cell>> {
    return this.get<Cell>(`/cells/${cellId}`);
  }

  // Production Cycles
  async getProductionCycles(cellId: string): Promise<ApiResponse<ProductionCycle[]>> {
    return this.get<ProductionCycle[]>(`/cells/${cellId}/production-cycles`);
  }

  async createProductionCycle(data: Omit<ProductionCycle, 'id'>): Promise<ApiResponse<ProductionCycle>> {
    return this.post<ProductionCycle>('/production-cycles', data);
  }

  // Downtimes
  async getDowntimes(cellId: string): Promise<ApiResponse<Downtime[]>> {
    return this.get<Downtime[]>(`/cells/${cellId}/downtimes`);
  }

  async createDowntime(data: Omit<Downtime, 'id'>): Promise<ApiResponse<Downtime>> {
    return this.post<Downtime>('/downtimes', data);
  }

  // Efficiency Metrics
  async getEfficiencyMetrics(
    entityType: EfficiencyMetric['entity_type'],
    entityId: string
  ): Promise<ApiResponse<EfficiencyMetric[]>> {
    return this.get<EfficiencyMetric[]>(`/efficiency-metrics/${entityType}/${entityId}`);
  }

  async calculateEfficiency(
    entityType: EfficiencyMetric['entity_type'],
    entityId: string
  ): Promise<ApiResponse<EfficiencyMetric>> {
    return this.post<EfficiencyMetric>(`/efficiency-metrics/calculate`, {
      entity_type: entityType,
      entity_id: entityId
    });
  }
} 