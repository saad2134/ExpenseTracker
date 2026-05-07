# ExpenseTracker

A modern, professional expense tracking application built with pure PHP, HTML, CSS, and JavaScript.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PHP](https://img.shields.io/badge/PHP-7.4+-777bb4.svg)
![Status](https://img.shields.io/badge/status-Active-green.svg)

## Features

### Dashboard
- Real-time expense overview with total spending
- Monthly expense summary
- Daily average spending calculation
- Interactive donut chart for category breakdown
- Recent transactions list
- Monthly trends bar chart

### Expense Management
- Add new expenses with description, amount, category, date, and payment method
- Edit existing expenses
- Delete expenses with confirmation
- Filter expenses by category and date range
- Search expenses by description or notes

### Reports
- Category-wise expense breakdown
- Top 5 highest expenses
- Export data to CSV and JSON formats

### Settings
- Multiple currency support (USD, EUR, GBP, JPY, INR)
- Configurable date formats
- Data backup functionality
- Clear all data option

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: PHP 7.4+
- **Data Storage**: JSON file storage
- **External Dependencies**: 
  - Font Awesome 6.4.0 (icons)
  - Google Fonts - Inter (typography)

## Project Structure

```
ExpenseTracker/
├── index.php          # Main application entry point
├── api/
│   └── expenses.php   # REST API for CRUD operations
├── css/
│   └── style.css      # Modern responsive styling
├── js/
│   └── app.js         # Frontend JavaScript logic
├── data/
│   └── expenses.json # Data persistence file
└── README.md          # Project documentation
```

## Installation & Setup

### Prerequisites
- PHP 7.4 or higher
- Web server (Apache, Nginx, or built-in PHP server)
- Write permissions for the `data/` directory

### Quick Start

1. **Clone or download the repository**

2. **Start the built-in PHP server** (recommended for testing):
   ```bash
   cd ExpenseTracker
   php -S localhost:8000
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

### Using XAMPP/WAMP

1. Copy the project folder to your server's web directory:
   - **XAMPP**: `C:\xampp\htdocs\ExpenseTracker`
   - **WAMP**: `C:\wamp\www\ExpenseTracker`

2. Start Apache from the control panel

3. Open your browser and navigate to:
   ```
   http://localhost/ExpenseTracker
   ```

### Using Nginx

Add this configuration to your nginx.conf:
```nginx
server {
    listen 80;
    server_name localhost;
    root /path/to/ExpenseTracker;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## How It Works

### Architecture Overview

1. **Frontend (index.php)**: Single-page application interface with multiple views
2. **API (api/expenses.php)**: Handles all HTTP requests (GET, POST, PUT, DELETE)
3. **Data Layer**: JSON file-based storage for simplicity

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `api/expenses.php` | Fetch all expenses (supports filtering) |
| POST | `api/expenses.php` | Create new expense |
| PUT | `api/expenses.php` | Update existing expense |
| DELETE | `api/expenses.php?id={id}` | Delete expense |
| GET | `api/expenses.php?action=export` | Export all data |

### Data Flow

```
User Action → JavaScript (app.js) → Fetch API → PHP API → JSON File
                ↓
           UI Update
```

### Expense Data Structure

```json
{
  "id": "unique_id",
  "description": "Expense description",
  "amount": 100.00,
  "category": "food",
  "date": "2024-01-15",
  "payment_method": "card",
  "notes": "Optional notes",
  "created_at": "2024-01-15 10:30:00"
}
```

### Available Categories

- 🍔 Food & Dining
- 🚗 Transportation
- 🛒 Shopping
- 💡 Utilities
- 🎬 Entertainment
- 🏥 Healthcare
- 📦 Other

## Configuration

### Currency Settings

Supported currencies in `Settings` → Currency dropdown:
- USD ($) - US Dollar
- EUR (€) - Euro
- GBP (£) - British Pound
- JPY (¥) - Japanese Yen
- INR (₹) - Indian Rupee

### Date Formats

- MM/DD/YYYY (US format)
- DD/MM/YYYY (European format)
- YYYY-MM-DD (ISO format)

## Usage Guide

### Adding an Expense

1. Click "Add Expense" in the sidebar
2. Fill in the form:
   - Description (required)
   - Amount (required, positive number)
   - Category (required)
   - Date (defaults to today)
   - Payment Method (optional)
   - Notes (optional)
3. Click "Add Expense" button
4. View the updated dashboard

### Filtering Expenses

1. Go to "Expenses" view
2. Select category filter (optional)
3. Set date range (optional)
4. Click "Apply Filters"
5. Use "Clear" to reset filters

### Exporting Data

- **CSV Export**: Click export button or go to Reports → Export to CSV
- **JSON Export**: Go to Reports → Export to JSON
- **Full Backup**: Settings → Backup Data (includes settings)

## Security Considerations

- Input validation on server-side
- JSON file stored outside public web root (in data/ folder)
- No sensitive data stored (no passwords/auth)
- File permissions should restrict write access to data folder only

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### PHP not found
Install PHP or add it to your system PATH.

### Permission denied errors
Grant write permissions to the `data/` folder:
```bash
# Linux/Mac
chmod 777 data/

# Windows (in PowerShell)
icacls data /grant Everyone:F
```

### Empty dashboard
Add your first expense using the "Add Expense" form.

### API errors
Check PHP error logs and ensure `data/expenses.json` exists.

## License

This project is licensed under the MIT License.

## Contributing

Feel free to fork this project and submit pull requests for improvements.

## Support

For issues or questions, please open an issue on the project repository.