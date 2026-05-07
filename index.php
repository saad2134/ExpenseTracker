<?php
session_start();
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ExpenseTracker - Professional Expense Management</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="app-container">
        <aside class="sidebar">
            <div class="logo">
                <i class="fas fa-wallet"></i>
                <span>ExpenseTracker</span>
            </div>
            <nav class="nav-menu">
                <a href="#" class="nav-item active" data-view="dashboard">
                    <i class="fas fa-chart-pie"></i>
                    <span>Dashboard</span>
                </a>
                <a href="#" class="nav-item" data-view="expenses">
                    <i class="fas fa-receipt"></i>
                    <span>Expenses</span>
                </a>
                <a href="#" class="nav-item" data-view="add-expense">
                    <i class="fas fa-plus-circle"></i>
                    <span>Add Expense</span>
                </a>
                <a href="#" class="nav-item" data-view="reports">
                    <i class="fas fa-file-alt"></i>
                    <span>Reports</span>
                </a>
                <a href="#" class="nav-item" data-view="settings">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </a>
            </nav>
            <div class="sidebar-footer">
                <div class="user-info">
                    <div class="user-avatar">U</div>
                    <div class="user-details">
                        <span class="user-name">User</span>
                        <span class="user-role">Premium</span>
                    </div>
                </div>
            </div>
        </aside>

        <main class="main-content">
            <header class="top-bar">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Search expenses...">
                </div>
                <div class="top-actions">
                    <button class="btn-icon" id="exportBtn" title="Export Data">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-icon" id="notificationBtn" title="Notifications">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge">3</span>
                    </button>
                </div>
            </header>

            <div class="content-area">
                <div id="dashboard-view" class="view active">
                    <div class="view-header">
                        <h1>Dashboard</h1>
                        <p class="subtitle">Overview of your expenses</p>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card total">
                            <div class="stat-icon">
                                <i class="fas fa-wallet"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Total Expenses</span>
                                <span class="stat-value" id="totalExpenses">$0.00</span>
                                <span class="stat-change positive">+2.5% from last month</span>
                            </div>
                        </div>
                        <div class="stat-card monthly">
                            <div class="stat-icon">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">This Month</span>
                                <span class="stat-value" id="monthlyExpenses">$0.00</span>
                                <span class="stat-change" id="monthlyChange">0 expenses</span>
                            </div>
                        </div>
                        <div class="stat-card average">
                            <div class="stat-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Daily Average</span>
                                <span class="stat-value" id="dailyAverage">$0.00</span>
                                <span class="stat-change">Last 30 days</span>
                            </div>
                        </div>
                        <div class="stat-card count">
                            <div class="stat-icon">
                                <i class="fas fa-list-ol"></i>
                            </div>
                            <div class="stat-info">
                                <span class="stat-label">Total Transactions</span>
                                <span class="stat-value" id="totalCount">0</span>
                                <span class="stat-change">All time</span>
                            </div>
                        </div>
                    </div>

                    <div class="dashboard-grid">
                        <div class="chart-container">
                            <div class="chart-header">
                                <h3>Expense Categories</h3>
                                <select id="chartPeriod">
                                    <option value="week">This Week</option>
                                    <option value="month" selected>This Month</option>
                                    <option value="year">This Year</option>
                                </select>
                            </div>
                            <div class="chart-body">
                                <div class="donut-chart" id="categoryChart">
                                    <div class="chart-center">
                                        <span class="chart-total" id="chartTotal">$0</span>
                                        <span class="chart-label">Total</span>
                                    </div>
                                </div>
                                <div class="chart-legend" id="categoryLegend"></div>
                            </div>
                        </div>

                        <div class="recent-transactions">
                            <div class="section-header">
                                <h3>Recent Transactions</h3>
                                <button class="btn-link" data-view="expenses">View All</button>
                            </div>
                            <div class="transactions-list" id="recentTransactions">
                                <div class="empty-state">
                                    <i class="fas fa-receipt"></i>
                                    <p>No transactions yet</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="trends-section">
                        <div class="section-header">
                            <h3>Monthly Trends</h3>
                        </div>
                        <div class="bar-chart" id="trendsChart">
                            <div class="bar-chart-bars" id="trendsBars"></div>
                            <div class="bar-chart-labels" id="trendsLabels"></div>
                        </div>
                    </div>
                </div>

                <div id="expenses-view" class="view">
                    <div class="view-header">
                        <h1>Expenses</h1>
                        <p class="subtitle">All your transaction history</p>
                    </div>

                    <div class="filters-bar">
                        <div class="filter-group">
                            <select id="filterCategory">
                                <option value="">All Categories</option>
                                <option value="food">Food & Dining</option>
                                <option value="transport">Transportation</option>
                                <option value="shopping">Shopping</option>
                                <option value="utilities">Utilities</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="health">Healthcare</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <input type="date" id="filterDateFrom" class="date-input">
                        </div>
                        <div class="filter-group">
                            <input type="date" id="filterDateTo" class="date-input">
                        </div>
                        <button class="btn-secondary" id="applyFilters">Apply Filters</button>
                        <button class="btn-secondary" id="clearFilters">Clear</button>
                    </div>

                    <div class="expenses-table-container">
                        <table class="expenses-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="expensesTableBody">
                                <tr>
                                    <td colspan="5" class="empty-cell">
                                        <div class="empty-state">
                                            <i class="fas fa-inbox"></i>
                                            <p>No expenses found</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="pagination" id="pagination"></div>
                </div>

                <div id="add-expense-view" class="view">
                    <div class="view-header">
                        <h1>Add Expense</h1>
                        <p class="subtitle">Record a new transaction</p>
                    </div>

                    <div class="form-container">
                        <form id="expenseForm" class="expense-form">
                            <div class="form-group">
                                <label for="expenseDescription">Description</label>
                                <input type="text" id="expenseDescription" name="description" 
                                       placeholder="Enter expense description" required>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="expenseAmount">Amount</label>
                                    <div class="input-with-icon">
                                        <i class="fas fa-dollar-sign"></i>
                                        <input type="number" id="expenseAmount" name="amount" 
                                               placeholder="0.00" step="0.01" min="0.01" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="expenseCategory">Category</label>
                                    <select id="expenseCategory" name="category" required>
                                        <option value="">Select Category</option>
                                        <option value="food">🍔 Food & Dining</option>
                                        <option value="transport">🚗 Transportation</option>
                                        <option value="shopping">🛒 Shopping</option>
                                        <option value="utilities">💡 Utilities</option>
                                        <option value="entertainment">🎬 Entertainment</option>
                                        <option value="health">🏥 Healthcare</option>
                                        <option value="other">📦 Other</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="expenseDate">Date</label>
                                    <input type="date" id="expenseDate" name="date" required>
                                </div>

                                <div class="form-group">
                                    <label for="expensePayment">Payment Method</label>
                                    <select id="expensePayment" name="payment_method">
                                        <option value="cash">Cash</option>
                                        <option value="card">Credit/Debit Card</option>
                                        <option value="bank">Bank Transfer</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="expenseNotes">Notes (Optional)</label>
                                <textarea id="expenseNotes" name="notes" 
                                          placeholder="Add any additional notes..." rows="3"></textarea>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn-primary">
                                    <i class="fas fa-plus"></i>
                                    Add Expense
                                </button>
                                <button type="reset" class="btn-secondary">
                                    <i class="fas fa-undo"></i>
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div id="reports-view" class="view">
                    <div class="view-header">
                        <h1>Reports</h1>
                        <p class="subtitle">Detailed expense analytics</p>
                    </div>

                    <div class="reports-grid">
                        <div class="report-card">
                            <div class="report-header">
                                <h3>Category Breakdown</h3>
                                <select id="reportPeriod">
                                    <option value="month">This Month</option>
                                    <option value="year">This Year</option>
                                    <option value="all">All Time</option>
                                </select>
                            </div>
                            <div class="report-body" id="categoryReport"></div>
                        </div>

                        <div class="report-card">
                            <div class="report-header">
                                <h3>Top Expenses</h3>
                            </div>
                            <div class="report-body" id="topExpenses"></div>
                        </div>
                    </div>

                    <div class="export-section">
                        <button class="btn-primary" id="exportCSV">
                            <i class="fas fa-file-csv"></i>
                            Export to CSV
                        </button>
                        <button class="btn-secondary" id="exportJSON">
                            <i class="fas fa-file-code"></i>
                            Export to JSON
                        </button>
                    </div>
                </div>

                <div id="settings-view" class="view">
                    <div class="view-header">
                        <h1>Settings</h1>
                        <p class="subtitle">Configure your preferences</p>
                    </div>

                    <div class="settings-grid">
                        <div class="settings-card">
                            <h3>Currency</h3>
                            <select id="currencySetting">
                                <option value="USD" selected>USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
                                <option value="INR">INR (₹)</option>
                            </select>
                        </div>

                        <div class="settings-card">
                            <h3>Date Format</h3>
                            <select id="dateFormatSetting">
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>

                        <div class="settings-card">
                            <h3>Data Management</h3>
                            <div class="settings-actions">
                                <button class="btn-secondary" id="backupData">
                                    <i class="fas fa-download"></i>
                                    Backup Data
                                </button>
                                <button class="btn-danger" id="clearData">
                                    <i class="fas fa-trash"></i>
                                    Clear All Data
                                </button>
                            </div>
                        </div>

                        <div class="settings-card">
                            <h3>About</h3>
                            <p class="about-text">ExpenseTracker v1.0.0</p>
                            <p class="about-text">A simple and elegant expense tracking solution.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <div class="modal" id="editModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Expense</h3>
                <button class="modal-close" id="closeModal">&times;</button>
            </div>
            <form id="editExpenseForm" class="expense-form">
                <input type="hidden" id="editExpenseId" name="id">
                <div class="form-group">
                    <label for="editDescription">Description</label>
                    <input type="text" id="editDescription" name="description" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editAmount">Amount</label>
                        <input type="number" id="editAmount" name="amount" step="0.01" min="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="editCategory">Category</label>
                        <select id="editCategory" name="category" required>
                            <option value="food">Food & Dining</option>
                            <option value="transport">Transportation</option>
                            <option value="shopping">Shopping</option>
                            <option value="utilities">Utilities</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="health">Healthcare</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="editDate">Date</label>
                        <input type="date" id="editDate" name="date" required>
                    </div>
                    <div class="form-group">
                        <label for="editPayment">Payment Method</label>
                        <select id="editPayment" name="payment_method">
                            <option value="cash">Cash</option>
                            <option value="card">Credit/Debit Card</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="editNotes">Notes</label>
                    <textarea id="editNotes" name="notes" rows="2"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Save Changes</button>
                    <button type="button" class="btn-secondary" id="cancelEdit">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <div class="toast" id="toast">
        <i class="toast-icon"></i>
        <span class="toast-message"></span>
    </div>

    <script src="js/app.js"></script>
</body>
</html>