'use client';

import { useEffect } from 'react';
import { useProductionStore } from '@/services/productionService';
import ProductionForm from '@/components/ProductionForm';
import DashboardPreview from '@/components/DashboardPreview';
import { useUser } from '@clerk/nextjs';
import { UserButton } from "@clerk/nextjs";

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

  useEffect(() => {
    console.log('Dashboard mount - User state:', { 
      isUserLoaded, 
      userId: user?.id,
      isLoading 
    });

    if (isUserLoaded && user?.id) {
      console.log('Fetching dashboard data for user:', user.id);
      fetchDashboardData('default_cell_id', 'cell')
        .catch(err => console.error('Error fetching dashboard data:', err));
    }
  }, [user, isUserLoaded, fetchDashboardData]);

  console.log('Dashboard render state:', { 
    isUserLoaded, 
    isLoading, 
    error,
    hasUser: !!user,
    cyclesCount: productionCycles.length,
    efficiencyMetricsCount: efficiencyMetrics.length,
    currentEfficiency: efficiencyMetrics.length > 0 ? efficiencyMetrics[efficiencyMetrics.length - 1].efficiency : 'No metrics'
  });

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manufacturing Efficiency Tracking</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, {user?.firstName || user?.username}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Production Form Section */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Log Production Data</h2>
          <ProductionForm />
        </section>

        {/* Dashboard Preview Section */}
        <section className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Current Metrics</h2>
          <DashboardPreview 
            productionCycles={productionCycles}
            downtimes={downtimes}
            efficiencyMetrics={efficiencyMetrics}
          />
        </section>
      </div>
    </div>
  );
} 