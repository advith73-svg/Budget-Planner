import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";

// Library
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import Main, { mainLoader } from "./layouts/Main";

// Actions
import { logoutAction } from "./actions/logout";
import { deleteBudget } from "./actions/deleteBudget";

// Routes
import Dashboard, { dashboardAction, dashboardLoader } from "./pages/Dashboard";
import Error from "./pages/Error";
import BudgetPage, { budgetAction, budgetLoader } from "./pages/BudgetPage";
import ExpensesPage, {
  expensesAction,
  expensesLoader,
} from "./pages/ExpensesPage";

import Footer from "./pages/Footer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: mainLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
        loader: dashboardLoader,
        action: dashboardAction,
        errorElement: <Error />,
      },
      {
        path: "budget/:id",
        element: <BudgetPage />,
        loader: budgetLoader,
        action: budgetAction,
        errorElement: <Error />,
        children: [
          {
            path: "delete",
            action: deleteBudget,
          },
        ],
      },
      {
        path: "expenses",
        element: <ExpensesPage />,
        loader: expensesLoader,
        action: expensesAction,
        errorElement: <Error />,
      },
      {
        path: "logout",
        action: logoutAction,
      },
    ],
  },
]);

function App() {
  // 🔹 Read expenses from localStorage for analytics & export
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(storedExpenses);
  }, []);

  // 🔹 Monthly total calculation (analytics)
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // 🔹 CSV Export Function (Functional Feature)
  function exportExpensesCSV() {
    if (expenses.length === 0) return;

    const headers = "Description,Amount,Category\n";
    const rows = expenses
      .map(
        (e) =>
          `${e.description},${e.amount},${e.category || "Uncategorized"}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";
    link.click();
  }

  return (
    <div className="App">
      <RouterProvider router={router} />

      {/* 🔹 Simple global analytics & export */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <strong>Total Expenses:</strong> ₹{totalExpenses}
        <br />
        <button onClick={exportExpensesCSV} style={{ marginTop: "0.5rem" }}>
          Export Expenses (CSV)
        </button>
      </div>

      <ToastContainer />
      <Footer />
    </div>
  );
}

export default App;
