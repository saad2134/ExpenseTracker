const API_URL = 'api/expenses.php';

let expenses = [];
let currentPage = 1;
let notificationCount = 0;
const itemsPerPage = 10;
let settings = {
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY'
};

const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    INR: '₹'
};

const categoryColors = {
    food: '#f59e0b',
    transport: '#3b82f6',
    shopping: '#ec4899',
    utilities: '#10b981',
    entertainment: '#8b5cf6',
    health: '#ef4444',
    other: '#64748b'
};

const categoryIcons = {
    food: '🍔',
    transport: '🚗',
    shopping: '🛒',
    utilities: '💡',
    entertainment: '🎬',
    health: '🏥',
    other: '📦'
};

async function fetchExpenses(filters = {}) {
    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_URL}?${params}`);
        expenses = await response.json();
        return expenses;
    } catch (error) {
        console.error('Error fetching expenses:', error);
        showToast('Failed to load expenses', 'error');
        return [];
    }
}

async function addExpense(expense) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        });
        const result = await response.json();
        if (result.success) {
            showToast('Expense added successfully!', 'success');
            return true;
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        showToast('Failed to add expense', 'error');
    }
    return false;
}

async function updateExpense(expense) {
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        });
        const result = await response.json();
        if (result.success) {
            showToast('Expense updated successfully!', 'success');
            return true;
        }
    } catch (error) {
        console.error('Error updating expense:', error);
        showToast('Failed to update expense', 'error');
    }
    return false;
}

async function deleteExpense(id) {
    try {
        const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            showToast('Expense deleted!', 'success');
            return true;
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        showToast('Failed to delete expense', 'error');
    }
    return false;
}

function formatCurrency(amount) {
    return `${currencySymbols[settings.currency]}${parseFloat(amount).toFixed(2)}`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const format = settings.dateFormat;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    switch (format) {
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        default:
            return `${month}/${day}/${year}`;
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function updateDashboard() {
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    document.getElementById('totalExpenses').textContent = formatCurrency(total);
    
    const now = new Date();
    const thisMonth = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === now.getMonth() && 
               expDate.getFullYear() === now.getFullYear();
    });
    const monthlyTotal = thisMonth.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    document.getElementById('monthlyExpenses').textContent = formatCurrency(monthlyTotal);
    document.getElementById('monthlyChange').textContent = `${thisMonth.length} expenses`;
    
    const last30Days = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return expDate >= thirtyDaysAgo;
    });
    const dailyAvg = last30Days.length > 0 
        ? last30Days.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) / 30 
        : 0;
    document.getElementById('dailyAverage').textContent = formatCurrency(dailyAvg);
    
    document.getElementById('totalCount').textContent = expenses.length;
    
    notificationCount = Math.min(expenses.length, 5);
    const badge = document.getElementById('notificationBadge');
    if (notificationCount > 0) {
        badge.textContent = notificationCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
    
    updateCategoryChart();
    updateRecentTransactions();
    updateTrendsChart();
}

function updateCategoryChart() {
    const period = document.getElementById('chartPeriod').value;
    const now = new Date();
    
    let filteredExpenses = [];
    
    switch(period) {
        case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            filteredExpenses = expenses.filter(exp => new Date(exp.date) >= weekAgo);
            break;
        case 'month':
            filteredExpenses = expenses.filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === now.getMonth() && 
                       expDate.getFullYear() === now.getFullYear();
            });
            break;
        case 'year':
            filteredExpenses = expenses.filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getFullYear() === now.getFullYear();
            });
            break;
    }
    
    const categoryTotals = {};
    filteredExpenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
    });
    
    const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    document.getElementById('chartTotal').textContent = formatCurrency(total);
    
    const chart = document.getElementById('categoryChart');
    const legend = document.getElementById('categoryLegend');
    
    if (total === 0) {
        chart.style.background = '#e2e8f0';
        legend.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">No data available</p>';
        return;
    }
    
    let gradient = '';
    let cumulative = 0;
    const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    entries.forEach(([cat, amount]) => {
        const percent = (amount / total) * 100;
        const color = categoryColors[cat] || categoryColors.other;
        gradient += `${color} ${cumulative}deg ${cumulative + percent * 3.6}deg, `;
        cumulative += percent * 3.6;
    });
    
    chart.style.background = `conic-gradient(${gradient.slice(0, -2)})`;
    
    legend.innerHTML = entries
        .map(([cat, amount]) => `
            <div class="legend-item">
                <span class="legend-color" style="background: ${categoryColors[cat] || categoryColors.other}"></span>
                <span class="legend-label">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                <span class="legend-value">${formatCurrency(amount)}</span>
            </div>
        `).join('');
}

function updateRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    const recent = expenses.slice(0, 5);
    
    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recent.map(exp => `
        <div class="transaction-item">
            <div class="transaction-icon ${exp.category}">
                ${categoryIcons[exp.category] || categoryIcons.other}
            </div>
            <div class="transaction-details">
                <div class="transaction-desc">${exp.description}</div>
                <div class="transaction-meta">${formatDate(exp.date)} • ${exp.category}</div>
            </div>
            <div class="transaction-amount negative">-${formatCurrency(exp.amount)}</div>
        </div>
    `).join('');
}

function updateTrendsChart() {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const monthTotals = {};
    expenses.forEach(exp => {
        const d = new Date(exp.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!monthTotals[key]) {
            monthTotals[key] = {
                month: d.getMonth(),
                year: d.getFullYear(),
                total: 0
            };
        }
        monthTotals[key].total += parseFloat(exp.amount);
    });
    
    const monthsWithExpenses = Object.values(monthTotals)
        .sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
        })
        .slice(-6);
    
    const barsContainer = document.getElementById('trendsBars');
    const labelsContainer = document.getElementById('trendsLabels');
    
    if (monthsWithExpenses.length === 0) {
        barsContainer.innerHTML = '';
        labelsContainer.innerHTML = '<span class="bar-label">No data</span>';
        return;
    }
    
    const maxValue = Math.max(...monthsWithExpenses.map(m => m.total), 1);
    
    barsContainer.innerHTML = monthsWithExpenses.map(m => {
        const height = (m.total / maxValue) * 120;
        return `
        <div class="bar-wrapper">
            <div class="bar-value">${formatCurrency(m.total)}</div>
            <div class="bar" style="height: ${Math.max(height, 4)}px"></div>
        </div>
    `;
    }).join('');
    
    labelsContainer.innerHTML = monthsWithExpenses.map(m =>
        `<span class="bar-label">${monthNames[m.month]}</span>`
    ).join('');
}

function updateExpensesTable() {
    const tbody = document.getElementById('expensesTableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedExpenses = expenses.slice(start, start + itemsPerPage);
    
    if (paginatedExpenses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-cell">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>No expenses found</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = paginatedExpenses.map(exp => `
        <tr>
            <td>${formatDate(exp.date)}</td>
            <td>
                <div>${exp.description}</div>
                ${exp.notes ? `<small style="color: var(--text-muted)">${exp.notes}</small>` : ''}
            </td>
            <td>
                <span class="category-badge ${exp.category}">
                    ${categoryIcons[exp.category] || ''} ${exp.category}
                </span>
            </td>
            <td><strong>${formatCurrency(exp.amount)}</strong></td>
            <td>
                <div class="expense-actions">
                    <button class="btn-edit" onclick="openEditModal('${exp.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="confirmDelete('${exp.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePagination();
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(expenses.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = `
        <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<button disabled>...</button>`;
        }
    }
    
    html += `
        <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    updateExpensesTable();
}

function openEditModal(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
    
    document.getElementById('editExpenseId').value = expense.id;
    document.getElementById('editDescription').value = expense.description;
    document.getElementById('editAmount').value = expense.amount;
    document.getElementById('editCategory').value = expense.category;
    document.getElementById('editDate').value = expense.date;
    document.getElementById('editPayment').value = expense.payment_method || 'cash';
    document.getElementById('editNotes').value = expense.notes || '';
    
    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

async function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        await deleteExpense(id);
        await loadData();
    }
}

async function loadData() {
    await fetchExpenses();
    updateDashboard();
    updateExpensesTable();
    updateReports();
}

let reportPeriod = 'month';

function updateReports() {
    const now = new Date();
    
    updateCategoryReport();
    updatePaymentReport();
    updateDayBars();
    updateTopExpenses();
    updateMonthlyComparison();
}

function getFilteredExpenses(period) {
    const now = new Date();
    switch(period) {
        case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return expenses.filter(exp => new Date(exp.date) >= weekAgo);
        case 'month':
            return expenses.filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
            });
        case 'year':
            return expenses.filter(exp => new Date(exp.date).getFullYear() === now.getFullYear());
        default:
            return [...expenses];
    }
}

function getLastMonthExpenses() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === lastMonth.getMonth() && expDate.getFullYear() === lastMonth.getFullYear();
    });
}

function getUniqueDays() {
    const days = new Set(expenses.map(exp => exp.date));
    return Math.max(days.size, 1);
}

function updateCategoryReport() {
    const categoryReport = document.getElementById('categoryReport');
    const reportDonut = document.getElementById('reportDonut');
    let filtered = reportPeriod === 'week' ? getFilteredExpenses('week') : 
                   reportPeriod === 'month' ? getFilteredExpenses('month') : 
                   getFilteredExpenses('year');
    
    const categoryTotals = {};
    filtered.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
    });
    
    const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    if (total === 0) {
        categoryReport.innerHTML = '<p style="color: var(--text-muted)">No data available</p>';
        reportDonut.style.background = '#e2e8f0';
        return;
    }
    
    let gradient = '';
    let cumulative = 0;
    sorted.forEach(([cat, amount]) => {
        const percent = (amount / total) * 100;
        const color = categoryColors[cat] || categoryColors.other;
        gradient += `${color} ${cumulative}deg ${cumulative + percent * 3.6}deg, `;
        cumulative += percent * 3.6;
    });
    reportDonut.style.background = `conic-gradient(${gradient.slice(0, -2)})`;
    
    categoryReport.innerHTML = sorted.map(([cat, amount]) => {
        const percent = ((amount / total) * 100).toFixed(1);
        return `
            <div class="report-item">
                <span class="report-item-label">
                    <span class="cat-dot" style="background: ${categoryColors[cat] || categoryColors.other}"></span>
                    ${cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
                <span class="report-item-value">${formatCurrency(amount)} <small>${percent}%</small></span>
            </div>
        `;
    }).join('');
}

function updatePaymentReport() {
    const paymentReport = document.getElementById('paymentReport');
    const paymentTotals = {};
    expenses.forEach(exp => {
        const method = exp.payment_method || 'cash';
        paymentTotals[method] = (paymentTotals[method] || 0) + parseFloat(exp.amount);
    });
    
    const total = Object.values(paymentTotals).reduce((a, b) => a + b, 0);
    const methodNames = { cash: 'Cash', card: 'Card', bank: 'Bank Transfer', other: 'Other' };
    const methodIcons = { cash: 'fa-money-bill', card: 'fa-credit-card', bank: 'fa-university', other: 'fa-ellipsis-h' };
    
    if (total === 0) {
        paymentReport.innerHTML = '<p style="color: var(--text-muted)">No data available</p>';
        return;
    }
    
    paymentReport.innerHTML = Object.entries(paymentTotals).map(([method, amount]) => {
        const percent = ((amount / total) * 100).toFixed(1);
        return `
            <div class="report-item">
                <span class="report-item-label">
                    <i class="fas ${methodIcons[method] || 'fa-wallet'}"></i>
                    ${methodNames[method] || method}
                </span>
                <span class="report-item-value">${formatCurrency(amount)} <small>${percent}%</small></span>
            </div>
        `;
    }).join('');
}

function updateDayBars() {
    const dayBars = document.getElementById('dayBars');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayTotals = Array(7).fill(0);
    
    expenses.forEach(exp => {
        const dayIndex = new Date(exp.date).getDay();
        dayTotals[dayIndex] += parseFloat(exp.amount);
    });
    
    const maxValue = Math.max(...dayTotals, 1);
    
    dayBars.innerHTML = days.map((day, i) => {
        const height = (dayTotals[i] / maxValue) * 80;
        return `
            <div class="day-bar-item">
                <span class="day-value">${dayTotals[i] > 0 ? formatCurrency(dayTotals[i]) : ''}</span>
                <div class="day-bar" style="height: ${Math.max(height, 4)}px"></div>
                <span class="day-label">${day}</span>
            </div>
        `;
    }).join('');
}

function updateTopExpenses() {
    const topExpensesEl = document.getElementById('topExpenses');
    const top = [...expenses].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)).slice(0, 5);
    
    if (top.length === 0) {
        topExpensesEl.innerHTML = '<p style="color: var(--text-muted)">No data available</p>';
        return;
    }
    
    topExpensesEl.innerHTML = top.map((exp, i) => {
        const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
        return `
            <div class="report-item">
                <span class="report-item-label">
                    ${i < 3 ? '<i class="fas fa-trophy" style="color: var(--text-muted)"></i>' : ''}
                    ${exp.description}
                </span>
                <span class="report-item-value">${formatCurrency(exp.amount)}</span>
            </div>
        `;
    }).join('');
}

function updateMonthlyComparison() {
    const now = new Date();
    const thisMonthTotal = getFilteredExpenses('month').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const lastMonthTotal = getLastMonthExpenses().reduce((sum, e) => sum + parseFloat(e.amount), 0);
    
    document.getElementById('thisMonthValue').textContent = formatCurrency(thisMonthTotal);
    document.getElementById('lastMonthValue').textContent = formatCurrency(lastMonthTotal);
    
    const maxValue = Math.max(thisMonthTotal, lastMonthTotal, 1);
    document.getElementById('thisMonthBar').style.width = `${(thisMonthTotal / maxValue) * 100}%`;
    document.getElementById('lastMonthBar').style.width = `${(lastMonthTotal / maxValue) * 100}%`;
    
    const changeDisplay = document.getElementById('monthlyChangeDisplay');
    if (lastMonthTotal === 0) {
        changeDisplay.innerHTML = '<span class="change-badge">-</span>';
    } else {
        const change = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        const isPositive = change > 0;
        changeDisplay.innerHTML = `
            <span class="change-badge ${isPositive ? 'negative' : 'positive'}">
                ${isPositive ? '+' : ''}${change.toFixed(1)}% ${isPositive ? 'more' : 'less'}
            </span>
        `;
    }
}

function updateCustomRange() {
    const from = document.getElementById('reportDateFrom').value;
    const to = document.getElementById('reportDateTo').value;
    const result = document.getElementById('rangeResult');
    
    if (!from || !to) return;
    
    const filtered = expenses.filter(exp => {
        const date = new Date(exp.date);
        return date >= new Date(from) && date <= new Date(to);
    });
    
    const total = filtered.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const count = filtered.length;
    const avg = count > 0 ? total / count : 0;
    
    result.classList.add('active');
    result.innerHTML = `
        <div class="range-result-grid">
            <div class="range-stat">
                <div class="range-stat-label">Total</div>
                <div class="range-stat-value">${formatCurrency(total)}</div>
            </div>
            <div class="range-stat">
                <div class="range-stat-label">Expenses</div>
                <div class="range-stat-value">${count}</div>
            </div>
            <div class="range-stat">
                <div class="range-stat-label">Average</div>
                <div class="range-stat-value">${formatCurrency(avg)}</div>
            </div>
        </div>
    `;
}

function exportToCSV() {
    if (expenses.length === 0) {
        showToast('No data to export', 'warning');
        return;
    }
    
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Payment Method', 'Notes'];
    const rows = expenses.map(exp => [
        exp.date,
        exp.description,
        exp.category,
        exp.amount,
        exp.payment_method || '',
        exp.notes || ''
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    downloadFile(csv, 'expenses.csv', 'text/csv');
    showToast('CSV exported successfully!', 'success');
}

function exportToJSON() {
    if (expenses.length === 0) {
        showToast('No data to export', 'warning');
        return;
    }
    
    const json = JSON.stringify(expenses, null, 2);
    downloadFile(json, 'expenses.json', 'application/json');
    showToast('JSON exported successfully!', 'success');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function backupData() {
    const data = {
        expenses: expenses,
        settings: settings,
        exportDate: new Date().toISOString()
    };
    downloadFile(JSON.stringify(data, null, 2), 'expense_tracker_backup.json', 'application/json');
    showToast('Backup created successfully!', 'success');
}

async function clearAllData() {
    if (confirm('Are you sure you want to delete ALL expenses? This action cannot be undone!')) {
        if (confirm('This will permanently delete all your data. Continue?')) {
            for (const exp of [...expenses]) {
                await deleteExpense(exp.id);
            }
            await loadData();
            showToast('All data cleared', 'success');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(`${view}-view`).classList.add('active');
            
            if (view === 'expenses') {
                updateExpensesTable();
            } else if (view === 'reports') {
                updateReports();
            }
        });
    });
    
    document.getElementById('expenseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const expense = {
            description: document.getElementById('expenseDescription').value,
            amount: parseFloat(document.getElementById('expenseAmount').value),
            category: document.getElementById('expenseCategory').value,
            date: document.getElementById('expenseDate').value,
            payment_method: document.getElementById('expensePayment').value,
            notes: document.getElementById('expenseNotes').value
        };
        
        if (await addExpense(expense)) {
            e.target.reset();
            document.getElementById('expenseDate').value = today;
            loadData();
        }
    });
    
    document.getElementById('editExpenseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const expense = {
            id: document.getElementById('editExpenseId').value,
            description: document.getElementById('editDescription').value,
            amount: parseFloat(document.getElementById('editAmount').value),
            category: document.getElementById('editCategory').value,
            date: document.getElementById('editDate').value,
            payment_method: document.getElementById('editPayment').value,
            notes: document.getElementById('editNotes').value
        };
        
        if (await updateExpense(expense)) {
            closeEditModal();
            loadData();
        }
    });
    
    document.getElementById('closeModal').addEventListener('click', closeEditModal);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
    
    document.getElementById('editModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('editModal')) {
            closeEditModal();
        }
    });
    
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPopup = document.getElementById('notificationPopup');
    const closeNotification = document.getElementById('closeNotification');
    
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationPopup.classList.toggle('active');
        if (notificationPopup.classList.contains('active')) {
            loadNotificationList();
        }
    });
    
    closeNotification.addEventListener('click', () => {
        notificationPopup.classList.remove('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!notificationPopup.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationPopup.classList.remove('active');
        }
    });
    
    const userProfileBtn = document.getElementById('userProfileBtn');
    const profilePopup = document.getElementById('profilePopup');
    const closeProfile = document.getElementById('closeProfile');
    
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profilePopup.classList.toggle('active');
    });
    
    closeProfile.addEventListener('click', () => {
        profilePopup.classList.remove('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!profilePopup.contains(e.target) && !userProfileBtn.contains(e.target)) {
            profilePopup.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.profile-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab + 'Panel').classList.add('active');
        });
    });
    
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            const avatar = option.dataset.avatar;
            document.getElementById('userAvatar').textContent = avatar;
            document.getElementById('profileAvatar').textContent = avatar;
        });
    });
    
    document.getElementById('saveProfile').addEventListener('click', () => {
        const name = document.getElementById('profileNameInput').value || 'User';
        const email = document.getElementById('profileEmail').value;
        const avatar = document.querySelector('.avatar-option.active')?.dataset.avatar || 'U';
        
        document.getElementById('userName').textContent = name;
        document.getElementById('userRole').textContent = email || 'Premium';
        document.getElementById('profileName').textContent = name;
        
        showToast('Profile updated successfully!', 'success');
        profilePopup.classList.remove('active');
    });
    
    document.getElementById('darkModeToggle').addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            showToast('Logged out successfully!', 'success');
            profilePopup.classList.remove('active');
        }
    });
    
    function loadNotificationList() {
        const list = document.getElementById('notificationList');
        const recent = [...expenses].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
        
        if (recent.length === 0) {
            list.innerHTML = `
                <div class="notification-empty">
                    <i class="fas fa-bell-slash"></i>
                    <p>No recent purchases</p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = recent.map(exp => {
            const createdDate = new Date(exp.created_at);
            const timeAgo = getTimeAgo(createdDate);
            const icon = categoryIcons[exp.category] || '📦';
            const bgColor = categoryColors[exp.category] || '#64748b';
            
            return `
                <div class="notification-item">
                    <div class="notification-icon" style="background: ${bgColor}20; color: ${bgColor};">
                        ${icon}
                    </div>
                    <div class="notification-details">
                        <div class="notification-title">${exp.description}</div>
                        <div class="notification-meta">
                            <span>${exp.category}</span>
                            <span>•</span>
                            <span>${timeAgo}</span>
                        </div>
                    </div>
                    <div class="notification-amount">-${formatCurrency(exp.amount)}</div>
                </div>
            `;
        }).join('');
    }
    
    function getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return formatDate(date);
    }
    
    document.getElementById('applyFilters').addEventListener('click', async () => {
        const category = document.getElementById('filterCategory').value;
        const dateFrom = document.getElementById('filterDateFrom').value;
        const dateTo = document.getElementById('filterDateTo').value;
        
        await fetchExpenses({ category, dateFrom, dateTo });
        currentPage = 1;
        updateExpensesTable();
    });
    
    document.getElementById('clearFilters').addEventListener('click', async () => {
        document.getElementById('filterCategory').value = '';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        
        await fetchExpenses();
        currentPage = 1;
        updateExpensesTable();
    });
    
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    document.getElementById('exportJSON').addEventListener('click', exportToJSON);
    document.getElementById('backupData').addEventListener('click', backupData);
    document.getElementById('clearData').addEventListener('click', clearAllData);
    
    document.getElementById('chartPeriod').addEventListener('change', () => {
        updateCategoryChart();
    });
    
    document.getElementById('currencySetting').addEventListener('change', (e) => {
        settings.currency = e.target.value;
        updateDashboard();
        updateExpensesTable();
    });
    
    document.getElementById('dateFormatSetting').addEventListener('change', (e) => {
        settings.dateFormat = e.target.value;
        updateDashboard();
        updateExpensesTable();
    });
    
    document.querySelectorAll('.period-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            reportPeriod = tab.dataset.period;
            updateCategoryReport();
        });
    });
    
    document.getElementById('applyReportRange').addEventListener('click', updateCustomRange);
    
    document.getElementById('printReport').addEventListener('click', () => {
        window.print();
    });
    
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            document.getElementById('searchResultsSection').style.display = 'none';
            return;
        }
        
        const results = expenses.filter(exp =>
            exp.description.toLowerCase().includes(query) ||
            exp.category.toLowerCase().includes(query) ||
            exp.notes?.toLowerCase().includes(query)
        );
        
        showSearchResults(results, query);
    });
    
    document.getElementById('clearSearchResults').addEventListener('click', () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('searchResultsSection').style.display = 'none';
    });
    
    loadData();
});

function showSearchResults(results, query) {
    const section = document.getElementById('searchResultsSection');
    const count = document.getElementById('searchResultsCount');
    const list = document.getElementById('searchResultsList');
    
    count.textContent = results.length === 1 ? '1 result' : `${results.length} results`;
    
    if (results.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>No results found for "${query}"</p>
            </div>
        `;
    } else {
        list.innerHTML = results.map(exp => {
            const color = categoryColors[exp.category] || categoryColors.other;
            const icon = categoryIcons[exp.category] || categoryIcons.other;
            return `
                <div class="search-result-item">
                    <div class="search-result-icon" style="background: ${color}20; color: ${color};">
                        ${icon}
                    </div>
                    <div class="search-result-details">
                        <div class="search-result-title">${exp.description}</div>
                        <div class="search-result-meta">
                            <span>${exp.category.charAt(0).toUpperCase() + exp.category.slice(1)}</span>
                            <span>•</span>
                            <span>${formatDate(exp.date)}</span>
                            ${exp.notes ? `<span>•</span><span>${exp.notes}</span>` : ''}
                        </div>
                    </div>
                    <div class="search-result-amount">-${formatCurrency(exp.amount)}</div>
                </div>
            `;
        }).join('');
    }
    
    section.style.display = 'block';
}