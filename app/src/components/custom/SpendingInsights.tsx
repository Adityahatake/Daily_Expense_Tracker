import React from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Lightbulb, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useExpense } from '@/context/ExpenseContext';
import { 
  generateSpendingInsights, 
  getCurrentMonthExpenses, 
  getPreviousMonthExpenses,
  calculateTotal,
  formatCurrency,
  calculateMonthOverMonthChange,
  shouldShowBudgetWarning
} from '@/utils/helpers';
import { cn } from '@/lib/utils';

export const SpendingInsights: React.FC = () => {
  const { state } = useExpense();
  const { expenses, budget } = state;

  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const previousMonthExpenses = getPreviousMonthExpenses(expenses);
  const currentMonthTotal = calculateTotal(currentMonthExpenses);
  const previousMonthTotal = calculateTotal(previousMonthExpenses);

  const insights = generateSpendingInsights(
    expenses,
    currentMonthTotal,
    previousMonthTotal,
    budget.amount
  );

  const budgetUsedPercent = (currentMonthTotal / budget.amount) * 100;
  const showBudgetWarning = shouldShowBudgetWarning(currentMonthTotal, budget.amount);
  const budgetExceeded = currentMonthTotal > budget.amount;

  const momChange = calculateMonthOverMonthChange(currentMonthTotal, previousMonthTotal);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertCircle;
      case 'success':
        return TrendingDown;
      case 'info':
      default:
        return Lightbulb;
    }
  };

  const getInsightStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Budget Alert */}
      {showBudgetWarning && (
        <Alert className={cn(
          "border-2",
          budgetExceeded 
            ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700" 
            : "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700"
        )}>
          <AlertCircle className={cn(
            "h-5 w-5",
            budgetExceeded ? "text-red-600" : "text-orange-600"
          )} />
          <AlertTitle className={cn(
            budgetExceeded ? "text-red-800 dark:text-red-200" : "text-orange-800 dark:text-orange-200"
          )}>
            {budgetExceeded ? 'Budget Exceeded!' : 'Budget Warning'}
          </AlertTitle>
          <AlertDescription className={cn(
            budgetExceeded ? "text-red-700 dark:text-red-300" : "text-orange-700 dark:text-orange-300"
          )}>
            {budgetExceeded 
              ? `You've exceeded your monthly budget by ${formatCurrency(currentMonthTotal - budget.amount)}.`
              : `You've used ${budgetUsedPercent.toFixed(0)}% of your monthly budget. Only ${formatCurrency(budget.amount - currentMonthTotal)} remaining.`
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(currentMonthTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                {momChange.increased ? (
                  <TrendingUp className="w-5 h-5 text-white" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">vs Last Month</p>
                <p className={cn(
                  "text-xl font-bold",
                  momChange.increased ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                )}>
                  {momChange.increased ? '+' : '-'}{momChange.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Budget Left</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(Math.max(0, budget.amount - currentMonthTotal))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              Add more expenses to see personalized insights
            </p>
          ) : (
            <div className="space-y-3">
              {insights.map((insight, index) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border",
                      getInsightStyles(insight.type)
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{insight.title}</p>
                      <p className="text-sm opacity-90">{insight.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
