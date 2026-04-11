// script.js
let transactions = [];

// Load from localStorage
function loadTransactions() {
  const saved = localStorage.getItem('transactions');
  if (saved) {
    transactions = JSON.parse(saved);
  }
  renderSummary();
  renderTransactions();
}

// Save to localStorage
function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Calculate totals
function calculateTotals() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.type === 'income') totalIncome += parseFloat(t.amount);
    else totalExpense += parseFloat(t.amount);
  });

  const balance = totalIncome - totalExpense;
  const savings = balance > 0 ? balance : 0;

  return { totalIncome, totalExpense, balance, savings };
}

// Render Summary Cards
function renderSummary() {
  const { totalIncome, totalExpense, balance, savings } = calculateTotals();

  const summaryHTML = `
    <div class="card">
      <div class="card-header"><span>Income</span><i class="fa-solid fa-arrow-trend-up"></i></div>
      <h2>₦ ${totalIncome.toFixed(2)}</h2>
    </div>
    <div class="card">
      <div class="card-header"><span>Expenses</span><i class="fa-solid fa-arrow-trend-down"></i></div>
      <h2>₦ ${totalExpense.toFixed(2)}</h2>
    </div>
    <div class="card">
      <div class="card-header"><span>Savings</span><i class="fa-solid fa-piggy-bank"></i></div>
      <h2>₦ ${savings.toFixed(2)}</h2>
    </div>
    <div class="card">
      <div class="card-header"><span>Investments</span><i class="fa-solid fa-chart-line"></i></div>
        <h2>₦0.00</h2>
    </div>
  `;

  document.getElementById('summary-cards').innerHTML = summaryHTML;

  document.getElementById('balance-amount').textContent = `$${balance.toFixed(2)}`;
  document.getElementById('balance-growth').textContent = balance >= 0 ? '+12.5%' : '-3.2%';
  document.getElementById('balance-growth').style.color = balance >= 0 ? '#22c55e' : '#ef4444';

  // Simple donut update
  document.getElementById('donut-text').innerHTML = `<strong>$${totalExpense.toFixed(2)}</strong><small>this month</small>`;
}

// Render Transactions Table
function renderTransactions() {
  const tbody = document.getElementById('transactions-body');
  tbody.innerHTML = '';

  transactions.slice().reverse().forEach((t, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.description}</td>
      <td>${t.category}</td>
      <td>${t.type}</td>
      <td class="${t.type}">${t.type === 'income' ? '+' : '-'}$${parseFloat(t.amount).toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Show / Hide Modal
function showAddModal() {
  document.getElementById('add-modal').style.display = 'flex';
  document.getElementById('transaction-form').reset();
}

function hideAddModal() {
  document.getElementById('add-modal').style.display = 'none';
}

// Form Submit
document.getElementById('transaction-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const newTransaction = {
    id: Date.now(),
    type: document.getElementById('type').value,
    description: document.getElementById('description').value,
    amount: document.getElementById('amount').value,
    category: document.getElementById('category').value,
    date: document.getElementById('date').value || new Date().toISOString().split('T')[0]
  };

  transactions.push(newTransaction);
  saveTransactions();
  renderSummary();
  renderTransactions();
  hideAddModal();

  alert('Transaction added successfully!');
});

// Initialize
loadTransactions();