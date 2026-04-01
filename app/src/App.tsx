import { useState } from 'react';
import { Sidebar } from '@/components/custom/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { AddExpense } from '@/pages/AddExpense';
import { Expenses } from '@/pages/Expenses';
import { Reports } from '@/pages/Reports';
import { Settings } from '@/pages/Settings';
import { ExpenseProvider } from '@/context/ExpenseContext';
import type { Page } from '@/types';
import { Toaster } from '@/components/ui/sonner';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'add':
        return <AddExpense onSuccess={() => setCurrentPage('expenses')} />;
      case 'expenses':
        return <Expenses />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Mobile Header Spacing */}
        <div className="h-16 lg:hidden" />
        
        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

export default App;
