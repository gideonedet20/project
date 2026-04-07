# test_expense_tracker.py
import pytest
from expense_tracker import (
    validate_expense_input,
    add_expense,
    calculate_total_expenses,
    calculate_category_totals,
    get_expenses_by_date,
    format_expense_data,
    load_expenses_from_csv,
    save_expense_to_csv
)


def test_validate_expense_input():
    assert validate_expense_input("100", "food") == True
    assert validate_expense_input("-50", "food") == False
    assert validate_expense_input("abc", "food") == False
    assert validate_expense_input("200", "") == False
    assert validate_expense_input("150.75", "Transport") == True


def test_add_expense():
    expense = add_expense(100, "food")
    assert expense["amount"] == 100.0
    assert expense["category"] == "Food"
    assert "date" in expense


def test_calculate_total_expenses():
    expenses = [{"amount": 100}, {"amount": 200}, {"amount": 50}]
    assert calculate_total_expenses(expenses) == 350


def test_calculate_category_totals():
    expenses = [
        {"amount": 100, "category": "Food"},
        {"amount": 50, "category": "Food"},
        {"amount": 200, "category": "Transport"},
        {"amount": 75, "category": "Food"},
    ]
    result = calculate_category_totals(expenses)
    assert result["Food"] == 225
    assert result["Transport"] == 200


def test_get_expenses_by_date():
    expenses = [
        {"date": "2026-04-01", "amount": 100, "category": "Food"},
        {"date": "2026-04-05", "amount": 200, "category": "Transport"},
        {"date": "2026-04-10", "amount": 150, "category": "Food"},
    ]
    result = get_expenses_by_date(expenses, "2026-04-01", "2026-04-05")
    assert len(result) == 2
    assert result[0]["date"] == "2026-04-01"
    assert result[1]["date"] == "2026-04-05"


def test_format_expense_data():
    expense = {"date": "2026-04-05", "amount": 250.5, "category": "Books"}
    formatted = format_expense_data(expense)
    assert "2026-04-05" in formatted
    assert "Books" in formatted
    assert "250.50" in formatted