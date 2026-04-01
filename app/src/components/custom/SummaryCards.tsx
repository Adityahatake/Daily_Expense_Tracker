import React from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpense } from '@/context/ExpenseContext';
import { 
  formatCurrency, 
  getTodayExpenses, 
  getCurrentMonthExpenses, 
  getCurrentYearExpenses,
  calculateTotal,
  calculateMonthOverMonthChange,
  getPreviousMonthExpenses,
  shouldShowBudgetWarning
} from '@/utils/helpers';
import { cn } from '@/lib/utils';

export const SummaryCards: React.FC = () => {
  const { state } = useExpense();
  const { expenses, budget } = state;

  // Calculate totals
  const todayTotal = calculateTotal(getTodayExpenses(expenses));
  const currentMonthTotal = calculateTotal(getCurrentMonthExpenses(expenses));
  const previousMonthTotal = calculateTotal(getPreviousMonthExpenses(expenses));
  const yearTotal = calculateTotal(getCurrentYearExpenses(expenses));
  
  // Calculate budget info
  const budgetRemaining = budget.amount - currentMonthTotal;
  const budgetUsedPercent = (currentMonthTotal / budget.amount) * 100;
  const showBudgetWarning = shouldShowBudgetWarning(currentMonthTotal, budget.amount);

  // Month over month change
  const momChange = calculateMonthOverMonthChange(currentMonthTotal, previousMonthTotal);

  const cards = [
    {
      title: "Today's Spending",
      value: todayTotal,
      icon: Calendar,
      trend: null,
      color: 'blue',
    },
    {
      title: 'This Month',
      value: currentMonthTotal,
      icon: TrendingUp,
      trend: momChange.percentage > 0 ? {
        value: momChange.percentage,
        isPositive: !momChange.increased,
        label: 'vs last month'
      } : null,
      color: 'green',
    },
    {
      title: 'This Year',
      value: yearTotal,
      icon: DollarSign,
      trend: null,
      color: 'purple',
    },
    {
      title: 'Budget Remaining',
      value: budgetRemaining,
      icon: Wallet,
      trend: {
        value: budgetUsedPercent,
        isPositive: budgetUsedPercent < 80,
        label: `${budgetUsedPercent.toFixed(0)}% used`
      },
      color: showBudgetWarning ? 'red' : 'orange',
      isWarning: showBudgetWarning,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', icon: 'text-blue-500' },
      green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', icon: 'text-green-500' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', icon: 'text-purple-500' },
      orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', icon: 'text-orange-500' },
      red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', icon: 'text-red-500' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const colors = getColorClasses(card.color);
        const Icon = card.icon;
        
        return (
          <Card key={index} className={cn(
            "border-0 shadow-sm hover:shadow-md transition-shadow duration-200",
            card.isWarning && "border-2 border-red-200 dark:border-red-800"
          )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <Icon className={`w-4 h-4 ${colors.icon}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(card.value)}
              </div>
              {card.trend && (
                <div className="flex items-center gap-1 mt-2">
                  {card.trend.isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    card.trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {card.trend.value.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {card.trend.label}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
