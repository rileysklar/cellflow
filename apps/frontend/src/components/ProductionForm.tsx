'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useProductionStore, type ValueStream, type Cell } from '@/services/productionService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useUser } from '@clerk/nextjs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { calculateEfficiency } from '@/utils/calculations';

interface FormData {
  timestamp: string;
  duration_minutes: number;
  actual_cycle_time: number;
  status: 'completed' | 'interrupted' | 'error';
  notes: string;
  value_stream_id: string;
  cell_id: string;
}

const initialFormData: FormData = {
  timestamp: '',
  duration_minutes: 0,
  actual_cycle_time: 0,
  status: 'completed',
  notes: '',
  value_stream_id: '',
  cell_id: '',
};

const formatDateTimeLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function ProductionForm() {
  const { user } = useUser();
  
  const store = useProductionStore();
  const formData = store.formData || { ...initialFormData, timestamp: formatDateTimeLocal(new Date()) };
  const { 
    addProductionCycle, 
    isLoading,
    valueStreams,
    cells,
    fetchValueStreams,
    fetchCellsByValueStream,
    getCell,
    setFormData,
  } = store;

  const resetForm = useCallback(() => 
    setFormData({ ...initialFormData, timestamp: formatDateTimeLocal(new Date()) }),
    [setFormData]
  );

  // Use useRef to track if initial fetch has been done
  const initialFetchDone = useRef(false);

  // Fetch value streams only once on mount
  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchValueStreams();
      initialFetchDone.current = true;
    }
  }, [fetchValueStreams]);

  // Memoize selectValueStream to prevent recreating on every render
  const selectValueStream = useCallback(async (valueStreamId: string) => {
    setFormData({
      ...formData,
      value_stream_id: valueStreamId,
      cell_id: ''
    });

    await fetchCellsByValueStream(valueStreamId);
  }, [fetchCellsByValueStream, formData, setFormData]);

  // Memoize handleChange to prevent recreating on every render
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'value_stream_id' || name === 'cell_id') {
      return; // These are handled by their own handlers
    }
    
    setFormData({
      ...formData,
      [name]: ['actual_cycle_time', 'duration_minutes'].includes(name) 
        ? Number(value) 
        : value
    });
  }, [formData, setFormData]);

  // Memoize setCurrentTime
  const setCurrentTime = useCallback(() => {
    setFormData({
      ...formData,
      timestamp: formatDateTimeLocal(new Date())
    });
  }, [formData, setFormData]);

  // Memoize handleSubmit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      console.error('No user ID found');
      return;
    }

    const selectedCell = getCell(formData.cell_id);
    if (!selectedCell) {
      console.error('No cell selected');
      return;
    }

    // Validate cycle time
    if (formData.actual_cycle_time <= 0) {
      alert('Cycle time must be greater than 0 seconds');
      return;
    }

    if (formData.actual_cycle_time > selectedCell.target_cycle_time * 5) {
      const proceed = window.confirm(
        `The cycle time (${formData.actual_cycle_time}s) is more than 5x the target time (${selectedCell.target_cycle_time}s). Are you sure this is correct?`
      );
      if (!proceed) return;
    }

    const startTime = new Date(formData.timestamp);
    const endTime = new Date(startTime.getTime() + formData.duration_minutes * 60000);

    const productionData = {
      cell_id: formData.cell_id,
      operator_id: user.id,
      start_time: startTime,
      end_time: endTime,
      actual_cycle_time: formData.actual_cycle_time,
      target_cycle_time: selectedCell.target_cycle_time,
      status: formData.status,
      notes: formData.notes,
      efficiency: calculateEfficiency(selectedCell.target_cycle_time, formData.actual_cycle_time)
    };

    try {
      await addProductionCycle(productionData);
      resetForm();
    } catch (error) {
      console.error('Error submitting production cycle:', error);
    }
  }, [user, formData, getCell, addProductionCycle, resetForm]);

  const selectedCell = useMemo(() => getCell(formData.cell_id), [formData.cell_id, getCell]);

  const handleValueStreamChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const valueStreamId = e.target.value;
    selectValueStream(valueStreamId);
  }, [selectValueStream]);

  const handleCellChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const cellId = e.target.value;
    setFormData({
      ...formData,
      cell_id: cellId
    });
  }, [formData, setFormData]);

  // Remove excessive logging that causes re-renders
  // Only log important state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Form state updated:', {
        valueStreams: valueStreams.length,
        cells: cells.length,
        selectedValueStream: formData.value_stream_id,
        selectedCell: formData.cell_id
      });
    }
  }, [valueStreams.length, cells.length, formData.value_stream_id, formData.cell_id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Production Cycle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Value Stream and Cell Selection */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label htmlFor="value_stream_id" className="text-sm font-medium text-gray-700">
                Value Stream
              </label>
              <select
                id="value_stream_id"
                name="value_stream_id"
                value={formData.value_stream_id}
                onChange={handleValueStreamChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Value Stream</option>
                {valueStreams.map((vs: ValueStream) => (
                  <option key={vs.id} value={vs.id}>{vs.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 space-y-2">
              <label htmlFor="cell_id" className="text-sm font-medium text-gray-700">
                Cell
              </label>
              <select
                id="cell_id"
                name="cell_id"
                value={formData.cell_id}
                onChange={handleCellChange}
                disabled={!formData.value_stream_id}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select Cell</option>
                {cells.map((cell: Cell) => (
                  <option key={cell.id} value={cell.id}>{cell.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time and Duration */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-[2] space-y-2">
              <label htmlFor="timestamp" className="text-sm font-medium text-gray-700">
                Start Time
              </label>
              <div className="flex sm:flex-col gap-2">
                <Input
                  id="timestamp"
                  name="timestamp"
                  type="datetime-local"
                  required
                  value={formData.timestamp}
                  onChange={handleChange}
                  className="flex-1"
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={setCurrentTime}
                  className="shrink-0"
                >
                  Current Time
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <label htmlFor="duration_minutes" className="text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                required
                min="0"
                step="1"
                value={formData.duration_minutes}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Cycle Time and Status */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label htmlFor="actual_cycle_time" className="text-sm font-medium text-gray-700">
                Actual Cycle Time (seconds)
              </label>
              <Input
                id="actual_cycle_time"
                name="actual_cycle_time"
                type="number"
                required
                min="0"
                value={formData.actual_cycle_time}
                onChange={handleChange}
              />
              {selectedCell && (
                <div className="text-sm text-gray-500">
                  Target: {selectedCell.target_cycle_time} seconds
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="completed">Completed</option>
                <option value="interrupted">Interrupted</option>
                <option value="error">Error</option>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes
            </label>
            <Input
              id="notes"
              name="notes"
              type="text"
              placeholder="Add any relevant notes about this production cycle"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !formData.cell_id}
            className="w-full"
          >
            {isLoading ? 'Submitting...' : 'Log Production Cycle'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 