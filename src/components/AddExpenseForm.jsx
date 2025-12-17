// react imports
import { useEffect, useRef } from "react";

// rrd imports
import { useFetcher } from "react-router-dom";

// library imports
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const AddExpenseForm = ({ budgets }) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  // These refs will be used to interact with the form and focus on specific input elements.
  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    if (!isSubmitting) {
      // clear form
      formRef.current.reset();
      // reset focus
      focusRef.current.focus();
    }
  }, [isSubmitting]);

  return (
    <div className="form-wrapper">
      <h2 className="h3">
        Add{" "}
        <span className="accent">
          <i>{budgets.length === 1 && `${budgets.map((budg) => budg.name)}`}</i>
        </span>{" "}
        Expense
      </h2>

      <fetcher.Form method="post" className="grid-sm" ref={formRef}>
        <div className="expense-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Expense Name</label>
            <input
              type="text"
              name="newExpense"
              id="newExpense"
              placeholder="e.g., Sofa"
              ref={focusRef}
              required
            />
          </div>

          <div className="expense-inputab">
            <div className="grid-xs">
              <label htmlFor="newExpenseAmount">Amount</label>
              <input
                type="number"
                step="1"
                inputMode="decimal"
                name="newExpenseAmount"
                id="newExpenseAmount"
                placeholder="e.g., ₹9000"
                required
              />
            </div>

            {/* 🔹 NEW: Expense Category */}
            <div className="grid-xs">
              <label htmlFor="newExpenseCategory">Expense Type</label>
              <select
                name="newExpenseCategory"
                id="newExpenseCategory"
                required
              >
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid-xs" hidden={budgets.length === 1}>
              <label htmlFor="newExpenseBudget">Budget Category</label>
              <select name="newExpenseBudget" id="newExpenseBudget" required>
                {budgets
                  .sort((a, b) => a.createdAt - b.createdAt)
                  .map((budget) => {
                    return (
                      <option key={budget.id} value={budget.id}>
                        {budget.name}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>
        </div>

        <input type="hidden" name="_action" value="createExpense" />

        <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
          {isSubmitting ? (
            <span>Submitting…</span>
          ) : (
            <>
              <span>Add Expense</span>
              <PlusCircleIcon width={20} />
            </>
          )}
        </button>
      </fetcher.Form>
    </div>
  );
};

export default AddExpenseForm;
