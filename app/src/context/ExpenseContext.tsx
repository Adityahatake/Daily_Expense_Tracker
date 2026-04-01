import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Expense, Budget, ExpenseFormData, FilterOptions } from '@/types';
import type { ReactNode } from 'react';
import { 
  getExpenses, 
  saveExpenses, 
  getBudget, 
  saveBudget,
  getDarkMode,
  saveDarkMode 
} from '@/utils/storage';
import { generateId } from '@/utils/helpers';

// State interface
interface ExpenseState {
  expenses: Expense[];
  budget: Budget;
  darkMode: boolean;
  filterOptions: FilterOptions;
  isLoading: boolean;
}

// Action types
type ExpenseAction =
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_BUDGET'; payload: Budget }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_FILTER_OPTIONS'; payload: FilterOptions }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_DATA' };

// Initial state
const initialFilterOptions: FilterOptions = {
  startDate: '',
  endDate: '',
  category: 'all',
  searchQuery: '',
};

const createInitialState = (): ExpenseState => ({
  expenses: [],
  budget: {
    amount: 2000,
    month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    year: new Date().getFullYear(),
  },
  darkMode: false,
  filterOptions: initialFilterOptions,
  isLoading: true,
});

// Reducer
const expenseReducer = (state: ExpenseState, action: ExpenseAction): ExpenseState => {
  switch (action.type) {
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(e =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(e => e.id !== action.payload),
      };
    case 'SET_BUDGET':
      return { ...state, budget: action.payload };
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'SET_FILTER_OPTIONS':
      return { ...state, filterOptions: { ...state.filterOptions, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET_DATA':
      return { ...createInitialState(), isLoading: false };
    default:
      return state;
  }
};

// Context interface
interface ExpenseContextType {
  state: ExpenseState;
  dispatch: React.Dispatch<ExpenseAction>;
  addExpense: (data: ExpenseFormData) => void;
  updateExpense: (id: string, data: ExpenseFormData) => void;
  deleteExpense: (id: string) => void;
  setBudget: (amount: number) => void;
  toggleDarkMode: () => void;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  clearAllData: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Provider component
interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, createInitialState());

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const expenses = getExpenses();
      const budget = getBudget();
      const darkMode = getDarkMode();

      dispatch({ type: 'SET_EXPENSES', payload: expenses });
      dispatch({ type: 'SET_BUDGET', payload: budget });
      dispatch({ type: 'SET_DARK_MODE', payload: darkMode });
      dispatch({ type: 'SET_LOADING', payload: false });

      // Apply dark mode class
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    loadData();
  }, []);

  // Persist expenses to localStorage
  useEffect(() => {
    if (!state.isLoading) {
      saveExpenses(state.expenses);
    }
  }, [state.expenses, state.isLoading]);

  // Persist budget to localStorage
  useEffect(() => {
    if (!state.isLoading) {
      saveBudget(state.budget);
    }
  }, [state.budget, state.isLoading]);

  // Persist dark mode to localStorage
  useEffect(() => {
    if (!state.isLoading) {
      saveDarkMode(state.darkMode);
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [state.darkMode, state.isLoading]);

  // Actions
  const addExpense = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: generateId(),
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
  };

  const updateExpense = (id: string, data: ExpenseFormData) => {
    const existingExpense = state.expenses.find(e => e.id === id);
    if (existingExpense) {
      const updatedExpense: Expense = {
        ...existingExpense,
        amount: parseFloat(data.amount),
        category: data.category,
        date: data.date,
        description: data.description,
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
    }
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  const setBudget = (amount: number) => {
    const now = new Date();
    dispatch({
      type: 'SET_BUDGET',
      payload: {
        amount,
        month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
        year: now.getFullYear(),
      },
    });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'SET_DARK_MODE', payload: !state.darkMode });
  };

  const setFilterOptions = (options: Partial<FilterOptions>) => {
    dispatch({ type: 'SET_FILTER_OPTIONS', payload: options as FilterOptions });
  };

  const resetFilters = () => {
    dispatch({ type: 'SET_FILTER_OPTIONS', payload: initialFilterOptions });
  };

  const clearAllData = () => {
    localStorage.removeItem('expense_tracker_expenses');
    localStorage.removeItem('expense_tracker_budget');
    dispatch({ type: 'RESET_DATA' });
    // After reset, just set state to empty
    dispatch({ type: 'SET_EXPENSES', payload: [] });
    // Reset budget to default initial state
    const now = new Date();
    dispatch({ 
      type: 'SET_BUDGET', 
      payload: {
        amount: 2000,
        month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
        year: now.getFullYear(),
      } 
    });
  };

  return (
    <ExpenseContext.Provider
      value={{
        state,
        dispatch,
        addExpense,
        updateExpense,
        deleteExpense,
        setBudget,
        toggleDarkMode,
        setFilterOptions,
        resetFilters,
        clearAllData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

// Custom hook
export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
