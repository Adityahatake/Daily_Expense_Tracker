import type { Expense, CategoryTotal, MonthlyTotal, SpendingInsight } from '@/types';
import { CATEGORIES, CATEGORY_COLORS, MONTHS, BUDGET_WARNING_THRESHOLD } from './constants';
import { format, parseISO, isWeekend, startOfMonth, endOfMonth, isWithinInterval, subMonths, getYear, getMonth } from 'date-fns';

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM dd, yyyy');
};

// Format date for input
export const formatDateForInput = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get category color
export const getCategoryColor = (categoryId: string): string => {
  return CATEGORY_COLORS[categoryId] || '#6b7280';
};

// Get category name
export const getCategoryName = (categoryId: string): string => {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category?.name || categoryId;
};

// Calculate total expenses
export const calculateTotal = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

// Get expenses by date range
export const getExpensesByDateRange = (
  expenses: Expense[],
  startDate: string,
  endDate: string
): Expense[] => {
  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, {
      start: parseISO(startDate),
      end: parseISO(endDate),
    });
  });
};

// Get expenses by category
export const getExpensesByCategory = (expenses: Expense[], categoryId: string): Expense[] => {
  if (categoryId === 'all') return expenses;
  return expenses.filter(e => e.category === categoryId);
};

// Get today's expenses
export const getTodayExpenses = (expenses: Expense[]): Expense[] => {
  const today = formatDateForInput(new Date());
  return expenses.filter(e => e.date === today);
};

// Get current month expenses
export const getCurrentMonthExpenses = (expenses: Expense[]): Expense[] => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  
  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start, end });
  });
};

// Get previous month expenses
export const getPreviousMonthExpenses = (expenses: Expense[]): Expense[] => {
  const now = new Date();
  const prevMonth = subMonths(now, 1);
  const start = startOfMonth(prevMonth);
  const end = endOfMonth(prevMonth);
  
  return expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return isWithinInterval(expenseDate, { start, end });
  });
};

// Get current year expenses
export const getCurrentYearExpenses = (expenses: Expense[]): Expense[] => {
  const currentYear = getYear(new Date());
  return expenses.filter(e => getYear(parseISO(e.date)) === currentYear);
};

// Calculate category totals
export const calculateCategoryTotals = (expenses: Expense[]): CategoryTotal[] => {
  const totals: Record<string, number> = {};
  
  expenses.forEach(expense => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
  });
  
  const totalAmount = calculateTotal(expenses);
  
  return Object.entries(totals)
    .map(([category, amount]) => ({
      category,
      amount,
      color: getCategoryColor(category),
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

// Calculate monthly totals for current year
export const calculateMonthlyTotals = (expenses: Expense[]): MonthlyTotal[] => {
  const currentYear = getYear(new Date());
  const monthlyData: Record<number, number> = {};
  
  // Initialize all months with 0
  for (let i = 0; i < 12; i++) {
    monthlyData[i] = 0;
  }
  
  expenses
    .filter(e => getYear(parseISO(e.date)) === currentYear)
    .forEach(expense => {
      const month = getMonth(parseISO(expense.date));
      monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });
  
  return Object.entries(monthlyData).map(([month, amount]) => ({
    month: MONTHS[parseInt(month)],
    amount,
  }));
};

// Calculate month-over-month change
export const calculateMonthOverMonthChange = (
  currentMonthTotal: number,
  previousMonthTotal: number
): { percentage: number; increased: boolean } => {
  if (previousMonthTotal === 0) {
    return { percentage: currentMonthTotal > 0 ? 100 : 0, increased: currentMonthTotal > 0 };
  }
  
  const change = currentMonthTotal - previousMonthTotal;
  const percentage = (change / previousMonthTotal) * 100;
  
  return {
    percentage: Math.abs(percentage),
    increased: change > 0,
  };
};

// Check if budget warning should be shown
export const shouldShowBudgetWarning = (spent: number, budget: number): boolean => {
  return spent >= budget * BUDGET_WARNING_THRESHOLD;
};

// Generate spending insights
export const generateSpendingInsights = (
  expenses: Expense[],
  currentMonthTotal: number,
  previousMonthTotal: number,
  budget: number
): SpendingInsight[] => {
  const insights: SpendingInsight[] = [];
  
  // Budget insight
  const budgetUsed = (currentMonthTotal / budget) * 100;
  if (budgetUsed >= 100) {
    insights.push({
      type: 'warning',
      title: 'Budget Exceeded',
      message: `You've exceeded your monthly budget by ${formatCurrency(currentMonthTotal - budget)}.`,
    });
  } else if (budgetUsed >= 80) {
    insights.push({
      type: 'warning',
      title: 'Budget Alert',
      message: `You've used ${budgetUsed.toFixed(0)}% of your monthly budget.`,
    });
  }
  
  // Month-over-month insight
  const momChange = calculateMonthOverMonthChange(currentMonthTotal, previousMonthTotal);
  if (momChange.percentage > 0) {
    insights.push({
      type: momChange.increased ? 'warning' : 'success',
      title: 'Monthly Comparison',
      message: momChange.increased
        ? `Spending increased by ${momChange.percentage.toFixed(1)}% compared to last month.`
        : `Spending decreased by ${momChange.percentage.toFixed(1)}% compared to last month.`,
    });
  }
  
  // Weekend spending insight
  const currentMonthExpenses = getCurrentMonthExpenses(expenses);
  const weekendExpenses = currentMonthExpenses.filter(e => isWeekend(parseISO(e.date)));
  const weekendTotal = calculateTotal(weekendExpenses);
  
  if (weekendTotal > currentMonthTotal * 0.3) {
    insights.push({
      type: 'info',
      title: 'Weekend Spending',
      message: `You spend ${formatCurrency(weekendTotal)} on weekends this month (${((weekendTotal / currentMonthTotal) * 100).toFixed(0)}% of total).`,
    });
  }
  
  // Top category insight
  const categoryTotals = calculateCategoryTotals(currentMonthExpenses);
  if (categoryTotals.length > 0 && categoryTotals[0].amount > currentMonthTotal * 0.3) {
    insights.push({
      type: 'info',
      title: 'Top Spending Category',
      message: `${getCategoryName(categoryTotals[0].category)} accounts for ${categoryTotals[0].percentage.toFixed(0)}% of your spending.`,
    });
  }
  
  return insights;
};

// Search expenses by description
export const searchExpenses = (expenses: Expense[], query: string): Expense[] => {
  if (!query.trim()) return expenses;
  
  const lowerQuery = query.toLowerCase();
  return expenses.filter(
    e =>
      e.description.toLowerCase().includes(lowerQuery) ||
      getCategoryName(e.category).toLowerCase().includes(lowerQuery)
  );
};

// Export to CSV
export const exportToCSV = (expenses: Expense[]): string => {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map(e => [
    formatDate(e.date),
    getCategoryName(e.category),
    e.description,
    e.amount.toFixed(2),
  ]);
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};

// Download file
export const downloadFile = (content: string, filename: string, type: string): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
