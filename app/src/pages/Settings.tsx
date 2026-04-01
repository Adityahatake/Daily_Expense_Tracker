import React from 'react';
import { BudgetSettings } from '@/components/custom/BudgetSettings';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your budget and application preferences
        </p>
      </div>

      {/* Budget Settings */}
      <BudgetSettings />
    </div>
  );
};
