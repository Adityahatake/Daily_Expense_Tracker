import type { Expense, Budget } from '@/types';
import { generateId, formatDateForInput } from './helpers';
import { subMonths } from 'date-fns';

// Generate sample expenses
export const generateSampleExpenses = (): Expense[] => {
  const expenses: Expense[] = [];
  const now = new Date();
  
  // Categories with typical expense patterns
  const categoryExpenses = [
    { category: 'food', descriptions: ['Grocery shopping', 'Restaurant dinner', 'Coffee shop', 'Lunch with colleagues', 'Fast food'], amounts: [45, 65, 8, 15, 12] },
    { category: 'transport', descriptions: ['Gas refill', 'Uber ride', 'Public transit', 'Parking fee', 'Car maintenance'], amounts: [50, 25, 5, 10, 120] },
    { category: 'shopping', descriptions: ['Clothing', 'Electronics', 'Home decor', 'Books', 'Accessories'], amounts: [80, 200, 45, 25, 35] },
    { category: 'entertainment', descriptions: ['Movie tickets', 'Streaming subscription', 'Concert', 'Game purchase', 'Night out'], amounts: [30, 15, 80, 60, 100] },
    { category: 'utilities', descriptions: ['Electricity bill', 'Internet bill', 'Water bill', 'Phone bill', 'Gas bill'], amounts: [120, 60, 40, 50, 80] },
    { category: 'health', descriptions: ['Pharmacy', 'Doctor visit', 'Gym membership', 'Vitamins', 'Dental checkup'], amounts: [25, 150, 40, 30, 200] },
    { category: 'housing', descriptions: ['Monthly rent', 'Home repairs', 'Furniture', 'Cleaning supplies', 'Gardening'], amounts: [1200, 150, 300, 25, 50] },
  ];
  
  // Generate expenses for the last 3 months
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const monthDate = subMonths(now, monthOffset);
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    
    // Generate 15-25 expenses per month
    const numExpenses = 15 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < numExpenses; i++) {
      const categoryData = categoryExpenses[Math.floor(Math.random() * categoryExpenses.length)];
      const descriptionIndex = Math.floor(Math.random() * categoryData.descriptions.length);
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const expenseDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      
      expenses.push({
        id: generateId(),
        amount: categoryData.amounts[descriptionIndex] + Math.floor(Math.random() * 20) - 10,
        category: categoryData.category,
        date: formatDateForInput(expenseDate),
        description: categoryData.descriptions[descriptionIndex],
        createdAt: expenseDate.toISOString(),
        updatedAt: expenseDate.toISOString(),
      });
    }
  }
  
  // Sort by date descending
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate sample budget
export const generateSampleBudget = (): Budget => {
  const now = new Date();
  return {
    amount: 2500,
    month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    year: now.getFullYear(),
  };
};

// Seed sample data to localStorage
export const seedSampleData = (): void => {
  const expenses = generateSampleExpenses();
  const budget = generateSampleBudget();
  
  localStorage.setItem('expense_tracker_expenses', JSON.stringify(expenses));
  localStorage.setItem('expense_tracker_budget', JSON.stringify(budget));
};

// Check if data exists
export const hasExistingData = (): boolean => {
  const expenses = localStorage.getItem('expense_tracker_expenses');
  return expenses !== null && JSON.parse(expenses).length > 0;
};
