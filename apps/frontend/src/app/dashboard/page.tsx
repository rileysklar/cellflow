'use client';

import { useEffect, useCallback } from 'react';
import { useProductionStore } from '@/services/productionService';
import ProductionForm from '@/components/ProductionForm';
import DashboardPreview from '@/components/DashboardPreview';
import Navigation from '@/components/Navigation';
import EfficiencyChart from '@/components/EfficiencyChart';
import { useUser } from '@clerk/nextjs';

const REFRESH_INTERVAL = 15000; // Refresh every 15 seconds

export default function DashboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { 
    productionCycles,
    downtimes,
    efficiencyMetrics,
    isLoading,
    error,
    fetchDashboardData 
  } = useProductionStore();

  // Memoize the fetch function
  const fetchData = useCallback(() => {
    if (isUserLoaded && user?.id) {
      fetchDashboardData('default_cell_id', 'cell')
        .catch(err => console.error('Error fetching dashboard data:', err));
    }
  }, [user, isUserLoaded, fetchDashboardData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up auto-refresh
  useEffect(() => {
    const intervalId = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  if (!isUserLoaded || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manufacturing Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Real-time production monitoring and efficiency tracking
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Charts and Metrics */}
          <div className="lg:col-span-8 space-y-8">
            {/* Efficiency Chart */}
            <EfficiencyChart 
              data={efficiencyMetrics} 
              targetEfficiency={85}
            />
            
            {/* Current Metrics */}
            <DashboardPreview 
              productionCycles={productionCycles}
              downtimes={downtimes}
              efficiencyMetrics={efficiencyMetrics}
            />
          </div>

          {/* Right Column - Production Form */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Log Production</h2>
              <ProductionForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 