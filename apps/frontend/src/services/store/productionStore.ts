import { create } from 'zustand';
import { ProductionService } from '../productionService';
import type { 
  ValueStream, 
  Cell, 
  ProductionCycle, 
  Downtime, 
  EfficiencyMetric,
  BaseEntity 
} from '../types';

interface ProductionState {
  valueStreams: ValueStream[];
  cells: Cell[];
  productionCycles: ProductionCycle[];
  downtimes: Downtime[];
  efficiencyMetrics: EfficiencyMetric[];
  selectedValueStream: ValueStream | null;
  selectedCell: Cell | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchValueStreams: () => Promise<void>;
  fetchCells: (valueStreamId: string) => Promise<void>;
  selectValueStream: (valueStream: ValueStream) => void;
  selectCell: (cell: Cell) => void;
  fetchProductionData: (cellId: string) => Promise<void>;
  submitProductionCycle: (data: Omit<ProductionCycle, keyof BaseEntity>) => Promise<void>;
  submitDowntime: (data: Omit<Downtime, keyof BaseEntity>) => Promise<void>;
}

const productionService = new ProductionService();

export const useProductionStore = create<ProductionState>((set, get) => ({
  valueStreams: [],
  cells: [],
  productionCycles: [],
  downtimes: [],
  efficiencyMetrics: [],
  selectedValueStream: null,
  selectedCell: null,
  isLoading: false,
  error: null,

  fetchValueStreams: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await productionService.getValueStreams();
      set({ valueStreams: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch value streams' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCells: async (valueStreamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productionService.getCells(valueStreamId);
      set({ cells: response.data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch cells' });
    } finally {
      set({ isLoading: false });
    }
  },

  selectValueStream: (valueStream: ValueStream) => {
    set({ selectedValueStream: valueStream });
    get().fetchCells(valueStream.id);
  },

  selectCell: (cell: Cell) => {
    set({ selectedCell: cell });
    get().fetchProductionData(cell.id);
  },

  fetchProductionData: async (cellId: string) => {
    set({ isLoading: true, error: null });
    try {
      const [cycles, downtimes, metrics] = await Promise.all([
        productionService.getProductionCycles(cellId),
        productionService.getDowntimes(cellId),
        productionService.getEfficiencyMetrics('cell', cellId)
      ]);

      set({
        productionCycles: cycles.data,
        downtimes: downtimes.data,
        efficiencyMetrics: metrics.data
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch production data' });
    } finally {
      set({ isLoading: false });
    }
  },

  submitProductionCycle: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await productionService.createProductionCycle(data);
      const cell = get().selectedCell;
      if (cell) {
        await get().fetchProductionData(cell.id);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to submit production cycle' });
    } finally {
      set({ isLoading: false });
    }
  },

  submitDowntime: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await productionService.createDowntime(data);
      const cell = get().selectedCell;
      if (cell) {
        await get().fetchProductionData(cell.id);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to submit downtime' });
    } finally {
      set({ isLoading: false });
    }
  }
})); 