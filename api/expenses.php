<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$dataFile = __DIR__ . '/../data/expenses.json';

function loadExpenses() {
    global $dataFile;
    $dir = dirname($dataFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }
    if (!file_exists($dataFile)) {
        return [];
    }
    $content = file_get_contents($dataFile);
    return $content ? json_decode($content, true) : [];
}

function saveExpenses($expenses) {
    global $dataFile;
    $dir = dirname($dataFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }
    file_put_contents($dataFile, json_encode($expenses, JSON_PRETTY_PRINT));
}

function generateId() {
    return uniqid() . '_' . time();
}

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($method) {
    case 'GET':
        if ($action === 'export') {
            $expenses = loadExpenses();
            echo json_encode($expenses);
            exit;
        }
        
        $expenses = loadExpenses();
        $category = isset($_GET['category']) ? $_GET['category'] : '';
        $dateFrom = isset($_GET['dateFrom']) ? $_GET['dateFrom'] : '';
        $dateTo = isset($_GET['dateTo']) ? $_GET['dateTo'] : '';
        
        if ($category || $dateFrom || $dateTo) {
            $expenses = array_filter($expenses, function($exp) use ($category, $dateFrom, $dateTo) {
                if ($category && $exp['category'] !== $category) return false;
                if ($dateFrom && $exp['date'] < $dateFrom) return false;
                if ($dateTo && $exp['date'] > $dateTo) return false;
                return true;
            });
        }
        
        usort($expenses, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });
        
        echo json_encode(array_values($expenses));
        break;

    case 'POST':
        $expenses = loadExpenses();
        
        $newExpense = [
            'id' => generateId(),
            'description' => $input['description'] ?? '',
            'amount' => floatval($input['amount'] ?? 0),
            'category' => $input['category'] ?? 'other',
            'date' => $input['date'] ?? date('Y-m-d'),
            'payment_method' => $input['payment_method'] ?? 'cash',
            'notes' => $input['notes'] ?? '',
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $expenses[] = $newExpense;
        saveExpenses($expenses);
        
        echo json_encode(['success' => true, 'expense' => $newExpense]);
        break;

    case 'PUT':
        $expenses = loadExpenses();
        $expenseId = $input['id'] ?? '';
        
        foreach ($expenses as &$exp) {
            if ($exp['id'] === $expenseId) {
                $exp['description'] = $input['description'] ?? $exp['description'];
                $exp['amount'] = isset($input['amount']) ? floatval($input['amount']) : $exp['amount'];
                $exp['category'] = $input['category'] ?? $exp['category'];
                $exp['date'] = $input['date'] ?? $exp['date'];
                $exp['payment_method'] = $input['payment_method'] ?? $exp['payment_method'];
                $exp['notes'] = $input['notes'] ?? $exp['notes'];
                $exp['updated_at'] = date('Y-m-d H:i:s');
                break;
            }
        }
        
        saveExpenses($expenses);
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $expenses = loadExpenses();
        $expenseId = isset($_GET['id']) ? $_GET['id'] : '';
        
        $expenses = array_filter($expenses, function($exp) use ($expenseId) {
            return $exp['id'] !== $expenseId;
        });
        
        saveExpenses(array_values($expenses));
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}