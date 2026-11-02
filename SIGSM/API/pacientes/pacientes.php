<?php
require_once __DIR__ . '/../../backend/models/Traslado.php'; 

header('Content-Type: application/json');
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);
    
    $ci = trim($datos['ci'] ?? '');
    $nombre = trim($datos['nombre'] ?? '');

    if (empty($ci) || empty($nombre)) {
        http_response_code(400);
        echo json_encode(['error' => 'La cédula y el nombre son obligatorios']);
        exit;
    }

    try {
        $trasladoObj = new Traslado();
        $resultado = $trasladoObj->crearPacienteBase($ci, $nombre);

        if ($resultado) {
            http_response_code(201);
            echo json_encode(['mensaje' => 'Paciente creado correctamente']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'No se pudo guardar el paciente']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error en la BD: ' . $e->getMessage()]);
    }
}