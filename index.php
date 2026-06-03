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
                <div class="user-info" id="userProfileBtn">
                    <div class="user-avatar" id="userAvatar">U</div>
                    <div class="user-details">
                        <span class="user-name" id="userName">User</span>
                        <span class="user-role" id="userRole">Premium</span>
                    </div>
                </div>
                
                <div class="profile-popup" id="profilePopup">
                    <div class="profile-header">
                        <div class="profile-avatar-large" id="profileAvatar">U</div>
                        <div class="profile-info">
                            <h3 id="profileName">User</h3>
                            <span id="profileRole">Premium Member</span>
                        </div>
                        <button class="profile-close" id="closeProfile">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="profile-tabs">
                        <button class="profile-tab active" data-tab="profile">Profile</button>
                        <button class="profile-tab" data-tab="settings">Settings</button>
                    </div>
                    
                    <div class="profile-content">
                        <div class="profile-panel active" id="profilePanel">
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text" id="profileNameInput" value="User">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="profileEmail" placeholder="user@example.com">
                            </div>
                            <div class="form-group">
                                <label>Avatar</label>
                                <div class="avatar-grid" id="avatarGrid">
                                    <div class="avatar-option active" data-avatar="U" style="background: #f59e0b;">U</div>
                                    <div class="avatar-option" data-avatar="A" style="background: #3b82f6;">A</div>
                                    <div class="avatar-option" data-avatar="M" style="background: #10b981;">M</div>
                                    <div class="avatar-option" data-avatar="J" style="background: #ec4899;">J</div>
                                    <div class="avatar-option" data-avatar="S" style="background: #8b5cf6;">S</div>
                                    <div class="avatar-option" data-avatar="K" style="background: #ef4444;">K</div>
                                </div>
                            </div>
                            <button class="btn-primary" id="saveProfile">Save Changes</button>
                        </div>
                        
                        <div class="profile-panel" id="settingsPanel">
                            <div class="settings-row">
                                <div class="settings-label">
                                    <i class="fas fa-palette"></i>
                                    <span>Theme</span>
                                </div>
                                <div class="theme-selector" id="profileThemeSelector">
                                    <button class="theme-option" data-theme="system" title="System">
                                        <i class="fas fa-desktop"></i>
                                    </button>
                                    <button class="theme-option" data-theme="light" title="Light">
                                        <i class="fas fa-sun"></i>
                                    </button>
                                    <button class="theme-option" data-theme="dark" title="Dark">
                                        <i class="fas fa-moon"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="settings-row">
                                <div class="settings-label">
                                    <i class="fas fa-bell"></i>
                                    <span>Notifications</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="notificationsToggle" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="settings-row">
                                <div class="settings-label">
                                    <i class="fas fa-key"></i>
                                    <span>Change Password</span>
                                </div>
                                <button class="btn-icon-small" id="changePasswordBtn">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-footer">
                        <button class="btn-danger" id="logoutBtn">
                            <i class="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
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
                        <span class="notification-badge" id="notificationBadge"></span>
                    </button>
                    <div class="notification-popup" id="notificationPopup">
                        <div class="notification-header">
                            <h3>Recent Purchases</h3>
                            <button class="notification-close" id="closeNotification">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="notification-list" id="notificationList">
                        </div>
                    </div>
                </div>
            </header>

            <div class="content-area">
                <div id="dashboard-view" class="view active">
                    <div class="view-header">
                        <h1>Dashboard</h1>
                        <p class="subtitle">Overview of your expenses</p>
                    </div>
                    
                    <div class="stats-grid" id="statsGrid">
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
                    <div class="form-container">
                        <div class="form-header">
                            <h1>Add Expense</h1>
                            <p class="subtitle">Record a new transaction</p>
                        </div>
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
                                <div class="report-period-tabs">
                                    <button class="period-tab active" data-period="week">Week</button>
                                    <button class="period-tab" data-period="month">Month</button>
                                    <button class="period-tab" data-period="year">Year</button>
                                </div>
                            </div>
                            <div class="report-chart-container">
                                <div class="report-donut" id="reportDonut"></div>
                                <div class="report-body" id="categoryReport"></div>
                            </div>
                        </div>

                        <div class="report-card">
                            <div class="report-header">
                                <h3>Monthly Comparison</h3>
                            </div>
                            <div class="comparison-container">
                                <div class="comparison-bar">
                                    <span class="comparison-label">This Month</span>
                                    <div class="comparison-track">
                                        <div class="comparison-fill" id="thisMonthBar" style="width: 0%"></div>
                                    </div>
                                    <span class="comparison-value" id="thisMonthValue">$0</span>
                                </div>
                                <div class="comparison-bar">
                                    <span class="comparison-label">Last Month</span>
                                    <div class="comparison-track">
                                        <div class="comparison-fill last" id="lastMonthBar" style="width: 0%"></div>
                                    </div>
                                    <span class="comparison-value" id="lastMonthValue">$0</span>
                                </div>
                            </div>
                            <div class="comparison-change" id="monthlyChangeDisplay">
                                <span class="change-badge">-</span>
                            </div>
                        </div>

                        <div class="report-card">
                            <div class="report-header">
                                <h3>Payment Methods</h3>
                            </div>
                            <div class="report-body" id="paymentReport"></div>
                        </div>

                        <div class="report-card">
                            <div class="report-header">
                                <h3>Spending by Day</h3>
                            </div>
                            <div class="day-bars" id="dayBars"></div>
                        </div>

                        <div class="report-card full-width">
                            <div class="report-header">
                                <h3>Top Expenses</h3>
                            </div>
                            <div class="report-body" id="topExpenses"></div>
                        </div>

                        <div class="report-card full-width">
                            <div class="report-header">
                                <h3>Custom Date Range</h3>
                            </div>
                            <div class="custom-range-form">
                                <div class="range-inputs">
                                    <div class="form-group">
                                        <label>From</label>
                                        <input type="date" id="reportDateFrom">
                                    </div>
                                    <div class="form-group">
                                        <label>To</label>
                                        <input type="date" id="reportDateTo">
                                    </div>
                                    <button class="btn-secondary" id="applyReportRange">Apply</button>
                                </div>
                                <div class="range-result" id="rangeResult"></div>
                            </div>
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
                        <button class="btn-secondary" id="printReport">
                            <i class="fas fa-print"></i>
                            Print Report
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
                            <h3>Theme</h3>
                            <div class="theme-selector" id="settingsThemeSelector" style="width: 100%; justify-content: center;">
                                <button class="theme-option" data-theme="system" title="System">
                                    <i class="fas fa-desktop"></i> System
                                </button>
                                <button class="theme-option" data-theme="light" title="Light">
                                    <i class="fas fa-sun"></i> Light
                                </button>
                                <button class="theme-option" data-theme="dark" title="Dark">
                                    <i class="fas fa-moon"></i> Dark
                                </button>
                            </div>
                        </div>

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

    <div class="search-dialog" id="searchResultsSection">
        <div class="search-dialog-content">
            <div class="search-dialog-header">
                <h2><i class="fas fa-search"></i> Search Results</h2>
                <div class="search-dialog-actions">
                    <span id="searchResultsCount"></span>
                    <button class="modal-close" id="closeSearchDialog">&times;</button>
                </div>
            </div>
            <div class="search-results-list" id="searchResultsList"></div>
            <div class="search-pagination" id="searchPagination"></div>
            <div class="search-dialog-footer">
                <button class="btn-secondary" id="clearSearchResults">Clear Search</button>
            </div>
        </div>
    </div>

    <div class="toast" id="toast">
        <i class="toast-icon"></i>
        <span class="toast-message"></span>
    </div>

    <script src="js/app.js"></script>
</body>
</html>