<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

$metodo = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Dividir URL en segmentos
$segments = explode('/', trim($uri, '/'));

if (isset($segments[0]) && $segments[0] === 'Prog') {
    array_shift($segments);
}
if (isset($segments[0]) && $segments[0] === 'TriAxisTechnologies-Proyecto2026') {
    array_shift($segments);
}
if (isset($segments[0]) && $segments[0] === 'SIGSM') {
    array_shift($segments);
}
if (isset($segments[0]) && $segments[0] === 'API') {
    array_shift($segments);
}

$resource = $segments[0] ?? '';
$resource2 = $segments[1] ?? null;
$id = $segments[2] ?? null;

// Obtener datos del body para POST/PUT
$input = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($resource) {
    case 'login':
        require_once __DIR__ . '/login.php';
        exit;

    case 'logout':
        require_once __DIR__ . '/logout.php';
        exit;

    case 'sesion':
        require_once __DIR__ . '/sesion.php';
        exit;
    
    case 'usuarios':
        if ($resource2 === null || is_numeric($resource2)) {
            require_once __DIR__ . '/usuarios/usuarios.php';
            exit;
        }

    if ($resource2 === 'administrativos') {
        require_once __DIR__ . '/usuarios/administrativos.php';
        exit;
    }

    if ($resource2 === 'enfermeros') {
        require_once __DIR__ . '/usuarios/enfermeros.php';
        exit;
    }

        http_response_code(404);
        echo json_encode([
            'error' => 'Tipo de usuario no encontrado'
        ]);
        exit;

    default:
        http_response_code(404);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => 'Endpoint no encontrado']);
}
