// rrd imports
import { Link, useFetcher } from "react-router-dom";

import { useState } from "react";
import { toast } from "react-toastify";

// library import
import {
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

// helper imports
import {
  formatCurrency,
  formatDateToLocaleString,
  updateExpense,
  getAllMatchingItems,
} from "../helpers";

const ExpenseItem = ({ expense, showBudget }) => {
  const fetcher = useFetcher();
  const [editing, setEditing] = useState(false);

  // ensure backward compatibility
  const [editedExpense, setEditedExpense] = useState({
    ...expense,
    category: expense.category || "Other",
  });

  // fetch the matching budget
  const budget = getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: expense.budgetId,
  })[0];

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditedExpense({ ...expense, category: expense.category || "Other" });
  };

  const handleEditSubmit = async () => {
    try {
      updateExpense(expense.id, editedExpense);
      toast.success("Expense updated successfully");
      toast.info("Please refresh the page to see changes");
      setEditing(false);
    } catch (error) {
      toast.error("Error updating expense");
    }
  };

  return (
    <>
      {/* Expense Name */}
      <td>
        {editing ? (
          <input
            type="text"
            value={editedExpense.name}
            onChange={(e) =>
              setEditedExpense((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        ) : (
          expense.name
        )}
      </td>

      {/* Amount */}
      <td>
        {editing ? (
          <input
            type="number"
            step="1"
            value={editedExpense.amount}
            onChange={(e) =>
              setEditedExpense((prev) => ({
                ...prev,
                amount: +e.target.value,
              }))
            }
          />
        ) : (
          formatCurrency(expense.amount)
        )}
      </td>

      {/* NEW: Category */}
      <td>
        {editing ? (
          <select
            value={editedExpense.category}
            onChange={(e) =>
              setEditedExpense((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          <span>{expense.category || "Other"}</span>
        )}
      </td>

      {/* Date */}
      <td>{formatDateToLocaleString(expense.createdAt)}</td>

      {/* Budget */}
      {showBudget && (
        <td>
          <Link to={`/budget/${budget.id}`}>{budget.name}</Link>
        </td>
      )}

      {/* Edit buttons */}
      <td>
        {editing ? (
          <div className="edit-form-buttons">
            <button onClick={handleEditSubmit} className="btn btn--dark">
              <CheckCircleIcon width={20} />
            </button>
            <button onClick={handleEditCancel} className="btn btn--light">
              <XCircleIcon width={20} />
            </button>
          </div>
        ) : (
          <div className="edit-buttons">
            <button onClick={handleEditClick} className="btn btn--dark">
              Edit <PencilIcon width={20} />
            </button>
          </div>
        )}
      </td>

      {/* Delete */}
      <td>
        <fetcher.Form method="post">
          <input type="hidden" name="_action" value="deleteExpense" />
          <input type="hidden" name="expenseId" value={expense.id} />
          <button
            type="submit"
            className="btn btn--warning"
            aria-label={`Delete ${expense.name} expense`}
          >
            <TrashIcon width={20} />
          </button>
        </fetcher.Form>
      </td>
    </>
  );
};

export default ExpenseItem;
