import React, { useState, useEffect } from 'react';
import { DollarSign, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useExpense } from '@/context/ExpenseContext';
import { formatCurrency, getCurrentMonthExpenses, calculateTotal, shouldShowBudgetWarning } from '@/utils/helpers';


export const BudgetSettings: React.FC = () => {
  const { state, setBudget, clearAllData } = useExpense();
  const { budget, expenses } = state;

  const [budgetAmount, setBudgetAmount] = useState(budget.amount.toString());
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setBudgetAmount(budget.amount.toString());
  }, [budget.amount]);

  const currentMonthTotal = calculateTotal(getCurrentMonthExpenses(expenses));
  const budgetRemaining = budget.amount - currentMonthTotal;
  const budgetUsedPercent = Math.min((currentMonthTotal / budget.amount) * 100, 100);
  const showWarning = shouldShowBudgetWarning(currentMonthTotal, budget.amount);

  const handleSave = () => {
    const amount = parseFloat(budgetAmount);
    if (amount > 0) {
      setIsSaving(true);
      setBudget(amount);
      setTimeout(() => {
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }, 500);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setBudgetAmount(value[0].toString());
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This will permanently delete all your expenses and reset your budget.')) {
      clearAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Configuration */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Monthly Budget
          </CardTitle>
          <CardDescription>
            Set your monthly spending limit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Budget Status</span>
              <span className={`text-sm font-medium ${
                showWarning ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
              }`}>
                {budgetUsedPercent.toFixed(0)}% Used
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  showWarning ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${budgetUsedPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Spent: {formatCurrency(currentMonthTotal)}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Remaining: {formatCurrency(Math.max(0, budgetRemaining))}
              </span>
            </div>
          </div>

          {/* Budget Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Monthly Budget Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="100"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="pl-10 text-lg"
                  placeholder="Enter budget amount"
                />
              </div>
            </div>

            {/* Quick Slider */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600 dark:text-gray-400">
                Quick Adjust
              </Label>
              <Slider
                value={[parseFloat(budgetAmount) || 0]}
                onValueChange={handleSliderChange}
                min={500}
                max={10000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$500</span>
                <span>$10,000</span>
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-2">
              {[1000, 2000, 3000, 5000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBudgetAmount(amount.toString())}
                  className="text-sm"
                >
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving || !budgetAmount || parseFloat(budgetAmount) <= 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : showSuccess ? 'Saved!' : 'Save Budget'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Data Management
          </CardTitle>
          <CardDescription>
            Manage your expense data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Reset All Data
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                This will delete all your expenses and reset your budget to the default value. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Data
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {expenses.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lifetime Spending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
