import React from 'react';
import { ExpenseList } from '@/components/custom/ExpenseList';

export const Expenses: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Expenses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View, search, and manage all your expense entries
        </p>
      </div>

      {/* Expense List */}
      <ExpenseList />
    </div>
  );
};
