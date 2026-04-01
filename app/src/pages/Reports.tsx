import React from 'react';
import { CategoryChart } from '@/components/custom/CategoryChart';
import { MonthlyChart } from '@/components/custom/MonthlyChart';
import { SpendingInsights } from '@/components/custom/SpendingInsights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpense } from '@/context/ExpenseContext';
import { 
  calculateCategoryTotals, 
  getCurrentMonthExpenses, 
  getCurrentYearExpenses,
  calculateTotal,
  formatCurrency,
  getCategoryName
} from '@/utils/helpers';
import { TrendingUp, PieChart, Calendar, DollarSign } from 'lucide-react';

export const Reports: React.FC = () => {
  const { state } = useExpense();
  const { expenses } = state;

  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const currentYearExpenses = getCurrentYearExpenses(expenses);
  const categoryTotals = calculateCategoryTotals(currentMonthExpenses);

  // Find top spending category
  const topCategory = categoryTotals.length > 0 ? categoryTotals[0] : null;

  // Calculate daily average for current month
  const daysInMonth = new Date().getDate();
  const dailyAverage = currentMonthExpenses.length > 0 
    ? calculateTotal(currentMonthExpenses) / daysInMonth 
    : 0;

  const stats = [
    {
      title: 'Monthly Average',
      value: formatCurrency(calculateTotal(currentMonthExpenses)),
      icon: Calendar,
      description: 'This month so far',
    },
    {
      title: 'Daily Average',
      value: formatCurrency(dailyAverage),
      icon: TrendingUp,
      description: 'Per day this month',
    },
    {
      title: 'Yearly Total',
      value: formatCurrency(calculateTotal(currentYearExpenses)),
      icon: DollarSign,
      description: 'Total this year',
    },
    {
      title: 'Top Category',
      value: topCategory ? getCategoryName(topCategory.category) : 'N/A',
      icon: PieChart,
      description: topCategory 
        ? `${formatCurrency(topCategory.amount)} (${topCategory.percentage.toFixed(0)}%)` 
        : 'No data',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Detailed insights into your spending patterns
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart />
        <MonthlyChart />
      </div>

      {/* Category Breakdown Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryTotals.length === 0 ? (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              No expenses this month
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Percentage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {categoryTotals.map((item) => (
                    <tr key={item.category} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {getCategoryName(item.category)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                        {item.percentage.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 w-1/3">
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: item.color 
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <SpendingInsights />
    </div>
  );
};
