// Expense Types
export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  amount: string;
  category: string;
  date: string;
  description: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

// Budget Types
export interface Budget {
  amount: number;
  month: string;
  year: number;
}

// Filter Types
export interface FilterOptions {
  startDate: string | undefined;
  endDate: string | undefined;
  category: string;
  searchQuery: string;
}

// Analytics Types
export interface CategoryTotal {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface MonthlyTotal {
  month: string;
  amount: number;
}

export interface SpendingInsight {
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
}

// App State
export interface AppState {
  expenses: Expense[];
  budget: Budget;
  darkMode: boolean;
}

// Navigation
export type Page = 'dashboard' | 'expenses' | 'add' | 'reports' | 'settings';

// Export Options
export interface ExportOptions {
  format: 'csv' | 'pdf';
  startDate?: string;
  endDate?: string;
  category?: string;
}
