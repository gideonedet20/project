
__author__ = "Gideon Edet"
"Expenise Tracker project"




# expense_tracker.py
import csv
import tkinter as tk
from tkinter import Frame, Label, Button, Entry, StringVar, messagebox
from datetime import datetime
from typing import List, Dict, Optional

CSV_FILE = "expenses.csv"
FIELDNAMES = ["date", "amount", "category"]


def validate_expense_input(amount: str, category: str) -> bool:
    """Validates that amount is a positive number and category is not empty."""
    if not category or not isinstance(category, str) or category.strip() == "":
        return False
    try:
        amt = float(amount)
        return amt > 0
    except (ValueError, TypeError):
        return False


def add_expense(amount: float, category: str, date: Optional[str] = None) -> Dict:
    """Creates an expense dictionary. Uses today's date if none provided."""
    if date is None:
        date = datetime.now().strftime("%Y-%m-%d")

    expense = {
        "date": date,
        "amount": float(amount),
        "category": category.strip().title()
    }
    return expense


def save_expense_to_csv(expense: Dict) -> None:
    """Appends a single expense to the CSV file."""
    file_exists = False
    try:
        with open(CSV_FILE, "r", newline="") as f:
            file_exists = True
    except FileNotFoundError:
        pass

    mode = "a" if file_exists else "w"
    with open(CSV_FILE, mode, newline="") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        if not file_exists:
            writer.writeheader()
        writer.writerow(expense)


def load_expenses_from_csv() -> List[Dict]:
    """Loads all expenses from CSV file. Returns empty list if file doesn't exist."""
    expenses = []
    try:
        with open(CSV_FILE, "r", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                row["amount"] = float(row["amount"])
                expenses.append(row)
    except FileNotFoundError:
        pass
    return expenses


def calculate_total_expenses(expenses: List[Dict]) -> float:
    """Returns the sum of all expense amounts."""
    return sum(expense.get("amount", 0) for expense in expenses)


def calculate_category_totals(expenses: List[Dict]) -> Dict[str, float]:
    """Returns a dictionary with total amount per category."""
    totals = {}
    for expense in expenses:
        cat = expense.get("category")
        if cat:
            totals[cat] = totals.get(cat, 0) + expense.get("amount", 0)
    return totals


def get_expenses_by_date(expenses: List[Dict], start_date: str, end_date: str) -> List[Dict]:
    """Filters expenses between start_date and end_date (inclusive)."""
    filtered = []
    for expense in expenses:
        exp_date = expense.get("date")
        if start_date <= exp_date <= end_date:
            filtered.append(expense)
    return filtered


def format_expense_data(expense: Dict) -> str:
    """Returns a nicely formatted string for one expense."""
    return f"{expense['date']} | {expense['category']:15} | ₦{expense['amount']:,.2f}"


def run_app():
    root = tk.Tk()
    root.title("Student Expense Tracker")
    root.geometry("400x400")

    # Variables
    amount_var = StringVar()
    category_var = StringVar()

    # Title
    Label(root, text="Expense Tracker", font=("Arial", 16)).pack(pady=10)

    # Amount input
    Label(root, text="Amount (₦):").pack()
    Entry(root, textvariable=amount_var).pack()

    # Category input
    Label(root, text="Category:").pack()
    Entry(root, textvariable=category_var).pack()

    # Output display
    output_label = Label(root, text="", justify="left")
    output_label.pack(pady=10)

    # Functions for buttons
    def handle_add():
        amount = amount_var.get()
        category = category_var.get()

        if validate_expense_input(amount, category):
            expense = add_expense(amount, category)
            save_expense_to_csv(expense)
            messagebox.showinfo("Success", "Expense added!")
            amount_var.set("")
            category_var.set("")
        else:
            messagebox.showerror("Error", "Invalid input")

    def handle_view():
        expenses = load_expenses_from_csv()
        if not expenses:
            output_label.config(text="No expenses yet.")
        else:
            text = "\n".join(format_expense_data(e) for e in expenses)
            output_label.config(text=text)

    def handle_total():
        expenses = load_expenses_from_csv()
        total = calculate_total_expenses(expenses)
        output_label.config(text=f"Total: ₦{total:,.2f}")

    def handle_category():
        expenses = load_expenses_from_csv()
        totals = calculate_category_totals(expenses)
        if totals:
            text = "\n".join(f"{k}: ₦{v:,.2f}" for k, v in totals.items())
            output_label.config(text=text)
        else:
            output_label.config(text="No data yet.")

    # Buttons
    Button(root, text="Add Expense", command=handle_add).pack(pady=5)
    Button(root, text="View Expenses", command=handle_view).pack(pady=5)
    Button(root, text="Total Spending", command=handle_total).pack(pady=5)
    Button(root, text="Category Totals", command=handle_category).pack(pady=5)

    root.mainloop()

# Optional: Simple main menu for running the program
if __name__ == "__main__":
    run_app()
    
    print("=== Student Expense Tracker ===")
    while True:
        print("\n1. Add Expense")
        print("2. View All Expenses")
        print("3. Show Total Spending")
        print("4. Show Category Totals")
        print("5. Exit")
        choice = input("Choose an option: ").strip()

        if choice == "1":
            amount = input("Enter amount (₦): ")
            category = input("Enter category (e.g., Food, Transport): ")
            if validate_expense_input(amount, category):
                expense = add_expense(amount, category)
                save_expense_to_csv(expense)
                print("✅ Expense added successfully!")
            else:
                print("❌ Invalid input! Amount must be positive and category cannot be empty.")

        elif choice == "2":
            expenses = load_expenses_from_csv()
            if not expenses:
                print("No expenses recorded yet.")
            else:
                for exp in expenses:
                    print(format_expense_data(exp))

        elif choice == "3":
            expenses = load_expenses_from_csv()
            total = calculate_total_expenses(expenses)
            print(f"Total expenses: ₦{total:,.2f}")

        elif choice == "4":
            expenses = load_expenses_from_csv()
            totals = calculate_category_totals(expenses)
            if totals:
                for cat, amt in totals.items():
                    print(f"{cat}: ₦{amt:,.2f}")
            else:
                print("No expenses recorded yet.")

        elif choice == "5":
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Try again.")
 