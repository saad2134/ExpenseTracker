const API_URL = 'api/expenses.php';

let expenses = [];
let currentPage = 1;
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
    
    updateCategoryChart();
    updateRecentTransactions();
    updateTrendsChart();
}

function updateCategoryChart() {
    const now = new Date();
    const thisMonth = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === now.getMonth() && 
               expDate.getFullYear() === now.getFullYear();
    });
    
    const categoryTotals = {};
    thisMonth.forEach(exp => {
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
    const entries = Object.entries(categoryTotals);
    
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
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push({
            name: monthNames[d.getMonth()],
            month: d.getMonth(),
            year: d.getFullYear()
        });
    }
    
    const barsContainer = document.getElementById('trendsBars');
    const labelsContainer = document.getElementById('trendsLabels');
    
    const monthlyTotals = months.map(m => {
        return expenses
            .filter(exp => {
                const d = new Date(exp.date);
                return d.getMonth() === m.month && d.getFullYear() === m.year;
            })
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    });
    
    const maxValue = Math.max(...monthlyTotals, 1);
    
    barsContainer.innerHTML = months.map((m, i) => `
        <div class="bar-wrapper">
            <div class="bar" style="height: ${(monthlyTotals[i] / maxValue) * 120}px"></div>
        </div>
    `).join('');
    
    labelsContainer.innerHTML = months.map(m => `
        <span class="bar-label">${m.name}</span>
    `).join('');
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

function updateReports() {
    const categoryReport = document.getElementById('categoryReport');
    const now = new Date();
    const thisMonth = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === now.getMonth() && 
               expDate.getFullYear() === now.getFullYear();
    });
    
    const categoryTotals = {};
    thisMonth.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
    });
    
    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    categoryReport.innerHTML = sorted.length > 0 
        ? sorted.map(([cat, amount]) => `
            <div class="report-item">
                <span class="report-item-label">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                <span class="report-item-value">${formatCurrency(amount)}</span>
            </div>
        `).join('')
        : '<p style="color: var(--text-muted)">No data available</p>';
    
    const topExpenses = [...expenses].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)).slice(0, 5);
    const topExpensesEl = document.getElementById('topExpenses');
    
    topExpensesEl.innerHTML = topExpenses.length > 0
        ? topExpenses.map(exp => `
            <div class="report-item">
                <span class="report-item-label">${exp.description}</span>
                <span class="report-item-value">${formatCurrency(exp.amount)}</span>
            </div>
        `).join('')
        : '<p style="color: var(--text-muted)">No data available</p>';
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
    
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const search = e.target.value.toLowerCase();
        const filtered = expenses.filter(exp => 
            exp.description.toLowerCase().includes(search) ||
            exp.category.toLowerCase().includes(search) ||
            exp.notes?.toLowerCase().includes(search)
        );
        
        const tbody = document.getElementById('expensesTableBody');
        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-cell">
                        <div class="empty-state">
                            <i class="fas fa-search"></i>
                            <p>No matching expenses found</p>
                        </div>
                    </td>
                </tr>
            `;
        } else {
            const start = (currentPage - 1) * itemsPerPage;
            const paginated = filtered.slice(start, start + itemsPerPage);
            tbody.innerHTML = paginated.map(exp => `
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
                            <button class="btn-edit" onclick="openEditModal('${exp.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-delete" onclick="confirmDelete('${exp.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    });
    
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    document.getElementById('exportJSON').addEventListener('click', exportToJSON);
    document.getElementById('backupData').addEventListener('click', backupData);
    document.getElementById('clearData').addEventListener('click', clearAllData);
    
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
    
    loadData();
});