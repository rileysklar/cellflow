'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProductionStore } from '@/services/productionService';
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
  const { 
    addProductionCycle, 
    isLoading,
    valueStreams,
    cells,
    fetchValueStreams,
    fetchCellsByValueStream,
    getCell
  } = useProductionStore();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Fetch value streams only once on mount
  useEffect(() => {
    console.log('Initial value streams fetch');
    fetchValueStreams();
  }, [fetchValueStreams]);

  // Simplified value stream selection
  const selectValueStream = async (valueStreamId: string) => {
    console.log('Selecting value stream:', valueStreamId);
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      value_stream_id: valueStreamId,
      cell_id: ''
    }));

    // Fetch cells
    await fetchCellsByValueStream(valueStreamId);
  };

  // Single debug log for state changes
  useEffect(() => {
    console.log('Form state updated:', {
      valueStreams: valueStreams.map(vs => ({ id: vs.id, name: vs.name })),
      cells: cells.map(cell => ({ id: cell.id, name: cell.name })),
      formData,
      isLoading
    });
  }, [valueStreams, cells, formData, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      console.log('No user ID found');
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

    console.log('Submitting production data:', {
      ...formData,
      operator_id: user.id,
      cell_target_time: selectedCell.target_cycle_time,
      start_time: startTime,
      end_time: endTime
    });

    const productionData = {
      cell_id: formData.cell_id,
      operator_id: user.id,
      start_time: startTime,
      end_time: endTime,
      actual_cycle_time: formData.actual_cycle_time,
      status: formData.status,
      notes: formData.notes,
      efficiency: calculateEfficiency(selectedCell.target_cycle_time, formData.actual_cycle_time),
    };

    await addProductionCycle(productionData);
    setFormData(initialFormData);
  };

  // Add detailed form state logging
  const logFormState = (label: string, data: any) => {
    console.log(`[${label}] Form State:`, {
      timestamp: new Date().toISOString(),
      data,
      valueStreams: valueStreams.map(vs => ({ id: vs.id, name: vs.name })),
      cells: cells.map(cell => ({ id: cell.id, name: cell.name }))
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'value_stream_id' || name === 'cell_id') {
      return; // These are handled by their own handlers
    }
    
    console.log('Form change:', { name, value });
    setFormData(prev => ({
      ...prev,
      [name]: ['actual_cycle_time', 'duration_minutes'].includes(name) 
        ? Number(value) 
        : value
    }));
  };

  const setCurrentTime = () => {
    setFormData(prev => ({
      ...prev,
      timestamp: formatDateTimeLocal(new Date())
    }));
  };

  const selectedCell = getCell(formData.cell_id);

  // Add debug logging for render state
  console.log('Form render state:', {
    valueStreams: valueStreams.map(vs => ({ id: vs.id, name: vs.name })),
    cells: cells.map(cell => ({ id: cell.id, name: cell.name })),
    formData,
    isLoading
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Production Cycle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Value Stream Selection */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Value Stream Selection
              </label>
              <div className="grid grid-cols-2 gap-2">
                {valueStreams.map(vs => (
                  <div
                    key={vs.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      console.log('Value stream div clicked:', vs.id);
                      selectValueStream(vs.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        selectValueStream(vs.id);
                      }
                    }}
                    className={`w-full p-2 text-sm rounded-md transition-colors cursor-pointer
                      ${formData.value_stream_id === vs.id 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {vs.name}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Selected: {valueStreams.find(vs => vs.id === formData.value_stream_id)?.name || 'None'}
              </div>
              <div className="text-xs text-blue-500 mt-1">
                Available Value Streams: {valueStreams.length}
              </div>
            </div>

            {/* Cell Selection */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Cell Selection
              </label>
              <div className="grid grid-cols-2 gap-2">
                {cells.map(cell => (
                  <div
                    key={cell.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      console.log('Cell div clicked:', cell.id);
                      setFormData(prev => ({
                        ...prev,
                        cell_id: cell.id
                      }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setFormData(prev => ({
                          ...prev,
                          cell_id: cell.id
                        }));
                      }
                    }}
                    className={`w-full p-2 text-sm rounded-md transition-colors cursor-pointer
                      ${!formData.value_stream_id && 'opacity-50 cursor-not-allowed'}
                      ${formData.cell_id === cell.id 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {cell.name}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Selected: {cells.find(cell => cell.id === formData.cell_id)?.name || 'None'}
              </div>
              {cells.length === 0 && formData.value_stream_id && (
                <div className="text-xs text-yellow-500">Loading cells...</div>
              )}
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
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="completed">Completed</option>
                <option value="interrupted">Interrupted</option>
                <option value="error">Error</option>
              </select>
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