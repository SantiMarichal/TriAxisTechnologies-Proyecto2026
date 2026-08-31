<?php

require_once __DIR__ . '/../backend/models/Administrativo.php';
require_once __DIR__ . '/../backend/models/Enfermero.php';

header('Content-Type: application/json; charset=utf-8');

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);

    exit;
}

$datos = json_decode(file_get_contents('php://input'), true);

if (!isset($datos['ci']) || !isset($datos['nombre']) || !isset($datos['pass'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Debe ingresar usuario y contraseña']);

    exit;
}

$ci = $datos['ci'];
$nombre = $datos['nombre'];
$pass = $datos['pass'];


/*Usuario administrador (Acceso total)
$adminCI = '00000000';
$adminPass = 'admin123'; 

if ($ci === $adminCI && $pass === $adminPass) {
    $usuarioAdmin = [
        'ci' => $adminCI,
        'nombre' => 'Administrador General',
        'Cargo' => 'Administrador'
    ];

    $_SESSION['usuario'] = $usuarioAdmin;

    echo json_encode([
        'mensaje' => 'Login correcto como Administrador',
        'usuario' => $usuarioAdmin
    ]);
    exit; 
}
*/


$Administrativo = new Administrativo();
$usuario = $Administrativo->login($ci, $nombre, $pass);

if ($usuario !== null) {

    $_SESSION['usuario'] = $usuario;
    echo json_encode([
        'mensaje' => 'Login correcto',
        'usuario' => $usuario
    ]);
    exit; 
}

$Enfermero = new Enfermero();
$usuario = $Enfermero->login($ci, $nombre, $pass);

if ($usuario !== null) {
    $_SESSION['usuario'] = $usuario;
    echo json_encode([
        'mensaje' => 'Login correcto',
        'usuario' => $usuario
    ]);
    exit; 
}

$Administrador = new Administrador();
$usuario = $Administrador->login($ci, $nombre, $pass);

if ($usuario !== null) {
    $_SESSION['usuario'] = $usuario;
    echo json_encode([
        'mensaje' => 'Login correcto',
        'usuario' => $usuario
    ]);
    exit; 
}

http_response_code(401);
echo json_encode(['error' => 'Usuario o contraseña incorrectos']);
exit;