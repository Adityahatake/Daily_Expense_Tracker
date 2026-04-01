import type { Expense, Budget } from '@/types';
import { STORAGE_KEYS, DEFAULT_BUDGET } from './constants';

// Expenses
export const getExpenses = (): Expense[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading expenses:', error);
    return [];
  }
};

export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses:', error);
  }
};

export const addExpense = (expense: Expense): void => {
  const expenses = getExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
};

export const updateExpense = (updatedExpense: Expense): void => {
  const expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === updatedExpense.id);
  if (index !== -1) {
    expenses[index] = updatedExpense;
    saveExpenses(expenses);
  }
};

export const deleteExpense = (id: string): void => {
  const expenses = getExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  saveExpenses(filtered);
};

// Budget
export const getBudget = (): Budget => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading budget:', error);
  }
  
  // Return default budget for current month
  const now = new Date();
  return {
    amount: DEFAULT_BUDGET,
    month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    year: now.getFullYear(),
  };
};

export const saveBudget = (budget: Budget): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  } catch (error) {
    console.error('Error saving budget:', error);
  }
};

// Dark Mode
export const getDarkMode = (): boolean => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return data ? JSON.parse(data) : false;
  } catch (error) {
    console.error('Error reading dark mode:', error);
    return false;
  }
};

export const saveDarkMode = (darkMode: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
  } catch (error) {
    console.error('Error saving dark mode:', error);
  }
};

// Clear all data
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.EXPENSES);
  localStorage.removeItem(STORAGE_KEYS.BUDGET);
};
