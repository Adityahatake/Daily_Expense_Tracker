# Daily Expense Tracker

A full-featured expense management application built with React, TypeScript, and Tailwind CSS. Track your daily expenses, visualize spending patterns, set budgets, and gain insights into your financial habits.

![Daily Expense Tracker](https://s2w37ilkw33ju.ok.kimi.link)

## Features

### Core Features

- **Expense Management**
  - Add, edit, and delete expenses
  - Fields: amount, category, date, description
  - Form validation and error handling

- **Time-based Tracking**
  - Today's spending summary
  - Monthly spending overview
  - Yearly total tracking

- **Category-wise Analytics**
  - 10 predefined categories (Food, Transport, Shopping, etc.)
  - Interactive pie chart showing spending distribution
  - Bar chart for monthly spending trends
  - Category breakdown table with percentages

- **Budget System**
  - Set custom monthly budget
  - Visual progress indicator
  - Warning alerts at 80% budget usage
  - Budget exceeded notifications

- **Spending Insights**
  - Month-over-month comparison
  - Weekend spending analysis
  - Top category identification
  - Personalized recommendations

- **Search & Filters**
  - Search by description
  - Filter by category
  - Date range filtering
  - Combined filter options

- **Data Persistence**
  - LocalStorage for data storage
  - Sample data pre-loaded for demonstration
  - Data reset functionality

- **Export Feature**
  - Export as CSV
  - Export as PDF with formatted tables

### UI/UX Features

- **Responsive Design**
  - Mobile-friendly sidebar navigation
  - Adaptive layouts for all screen sizes
  - Touch-friendly interface

- **Dark Mode**
  - Toggle between light and dark themes
  - Persistent theme preference
  - Smooth transitions

- **Navigation**
  - Sidebar with 5 sections: Dashboard, Add Expense, All Expenses, Reports, Settings
  - Active state indicators
  - Mobile hamburger menu

## Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **Recharts** - Data visualization
- **date-fns** - Date manipulation
- **jsPDF** - PDF generation
- **Lucide React** - Icon library

### State Management
- React Context API for global state
- Custom hooks for expense operations
- LocalStorage for persistence

## Project Structure

```
src/
├── components/
│   ├── custom/           # Custom application components
│   │   ├── Sidebar.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── CategoryChart.tsx
│   │   ├── MonthlyChart.tsx
│   │   ├── SpendingInsights.tsx
│   │   ├── BudgetSettings.tsx
│   │   └── RecentExpenses.tsx
│   └── ui/               # shadcn/ui components
├── context/
│   └── ExpenseContext.tsx # Global state management
├── pages/
│   ├── Dashboard.tsx
│   ├── AddExpense.tsx
│   ├── Expenses.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── types/
│   └── index.ts          # TypeScript interfaces
├── utils/
│   ├── constants.ts      # App constants
│   ├── helpers.ts        # Utility functions
│   ├── storage.ts        # LocalStorage operations
│   └── sampleData.ts     # Sample data generation
├── App.tsx
├── main.tsx
└── index.css
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or extract the project files

2. Install dependencies:
```bash
cd app
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage Guide

### Adding an Expense
1. Click "Add Expense" in the sidebar
2. Enter the amount
3. Select a category
4. Choose the date
5. Add a description
6. Click "Add Expense" to save

### Viewing Expenses
1. Click "All Expenses" in the sidebar
2. Use search to find specific expenses
3. Apply filters by category or date range
4. Edit or delete expenses using the action buttons
5. Export data as CSV or PDF

### Setting a Budget
1. Click "Settings" in the sidebar
2. Enter your monthly budget amount
3. Use the slider or preset buttons for quick adjustment
4. Click "Save Budget"

### Viewing Reports
1. Click "Reports" in the sidebar
2. View spending by category (pie chart)
3. See monthly trends (bar chart)
4. Check category breakdown table
5. Review spending insights

### Dark Mode
- Toggle dark mode using the button at the bottom of the sidebar
- Your preference is saved automatically

## Sample Data

The application comes with sample data pre-loaded to demonstrate functionality. The sample includes:
- 45-75 expenses across 3 months
- Various categories (Food, Transport, Shopping, etc.)
- Realistic spending patterns
- Default budget of $2,500

To reset to sample data, go to Settings and click "Reset Data".

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or feature requests, please create an issue in the repository.

---

**Live Demo:** https://s2w37ilkw33ju.ok.kimi.link
