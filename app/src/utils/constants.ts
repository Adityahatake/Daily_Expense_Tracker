import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', color: '#ef4444', icon: 'utensils' },
  { id: 'transport', name: 'Transportation', color: '#f97316', icon: 'car' },
  { id: 'shopping', name: 'Shopping', color: '#eab308', icon: 'shopping-bag' },
  { id: 'entertainment', name: 'Entertainment', color: '#8b5cf6', icon: 'film' },
  { id: 'utilities', name: 'Utilities', color: '#06b6d4', icon: 'zap' },
  { id: 'health', name: 'Health & Medical', color: '#ec4899', icon: 'heart' },
  { id: 'education', name: 'Education', color: '#14b8a6', icon: 'book' },
  { id: 'housing', name: 'Housing & Rent', color: '#6366f1', icon: 'home' },
  { id: 'travel', name: 'Travel', color: '#84cc16', icon: 'plane' },
  { id: 'other', name: 'Other', color: '#6b7280', icon: 'more-horizontal' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  food: '#ef4444',
  transport: '#f97316',
  shopping: '#eab308',
  entertainment: '#8b5cf6',
  utilities: '#06b6d4',
  health: '#ec4899',
  education: '#14b8a6',
  housing: '#6366f1',
  travel: '#84cc16',
  other: '#6b7280',
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DEFAULT_BUDGET = 2000;

export const STORAGE_KEYS = {
  EXPENSES: 'expense_tracker_expenses',
  BUDGET: 'expense_tracker_budget',
  DARK_MODE: 'expense_tracker_dark_mode',
};

export const BUDGET_WARNING_THRESHOLD = 0.8; // 80%
