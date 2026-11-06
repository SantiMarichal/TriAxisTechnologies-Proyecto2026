<?php
require_once __DIR__ . '/../../backend/models/Traslado.php';

header('Content-Type: application/json');
$metodo = $_SERVER['REQUEST_METHOD'];
$traslado = new Traslado();
try {
    switch ($metodo) {
        case 'GET':
            try {
                $pacientes = $traslado->obtenerPacientes();
                echo json_encode($pacientes);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;
        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);

            $ci = trim($datos['ci'] ?? '');
            $nombre = trim($datos['nombre'] ?? '');

            if (empty($ci) || empty($nombre)) {
                http_response_code(400);
                echo json_encode(['error' => 'La cédula y el nombre son obligatorios']);
                exit;
            }

            try {
                $traslado = new Traslado();
                $resultado = $traslado->crearPacienteBase($ci, $nombre);

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
            break;
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if ($id === null) {
                http_response_code(400);
                echo json_encode(['error' => 'Debe proporcionar el ID del paciente en la URL']);
                exit;
            }
            $resultado = $traslado->eliminarPaciente($id);
            if ($resultado) {
                http_response_code(200);
                echo json_encode(['mensaje' => 'Paciente eliminado correctamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo eliminar el paciente']);
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            break;
    }
}catch (Exception $e) { 
    http_response_code(500);
    echo json_encode(['error' => 'Error general: ' . $e->getMessage()]);
}
