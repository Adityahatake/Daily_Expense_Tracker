import React from 'react';
import { SummaryCards } from '@/components/custom/SummaryCards';
import { CategoryChart } from '@/components/custom/CategoryChart';
import { MonthlyChart } from '@/components/custom/MonthlyChart';
import { SpendingInsights } from '@/components/custom/SpendingInsights';
import { RecentExpenses } from '@/components/custom/RecentExpenses';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your spending and manage your budget
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart />
        <MonthlyChart />
      </div>

      {/* Insights and Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingInsights />
        <RecentExpenses />
      </div>
    </div>
  );
};
