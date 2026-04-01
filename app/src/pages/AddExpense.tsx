import React from 'react';
import { ExpenseForm } from '@/components/custom/ExpenseForm';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Receipt } from 'lucide-react';

interface AddExpenseProps {
  onSuccess?: () => void;
}

export const AddExpense: React.FC<AddExpenseProps> = ({ onSuccess }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add Expense
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Record a new expense entry
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <ExpenseForm onSuccess={onSuccess} />
        </div>

        {/* Tips */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Quick Tips
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Be specific with descriptions for better tracking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Categorize expenses correctly for accurate reports
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Add expenses immediately to avoid forgetting
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Review your spending weekly to stay on budget
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Receipt className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Categories
                </h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Organize your expenses into these categories:
              </p>
              <div className="flex flex-wrap gap-2">
                {['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Health'].map((cat) => (
                  <span 
                    key={cat}
                    className="px-2 py-1 text-xs bg-white dark:bg-gray-800 rounded-md text-gray-700 dark:text-gray-300"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
