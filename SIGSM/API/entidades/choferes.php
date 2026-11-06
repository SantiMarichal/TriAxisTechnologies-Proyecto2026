<?php
require_once __DIR__ . '/../../backend/models/Traslado.php';

header('Content-Type: application/json');
$metodo = $_SERVER['REQUEST_METHOD'];
$traslado = new Traslado();
try {
    switch ($metodo) {
        case 'GET':
            try {
                $choferes = $traslado->obtenerChoferes();
                echo json_encode($choferes);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;
        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);

            $cedula = trim($datos['cedula_chofer'] ?? '');
            $nombre = trim($datos['nombre_chofer'] ?? '');
            $apellido = trim($datos['apellido_chofer'] ?? '');
            $telefono = trim($datos['telefono'] ?? '');

            if (empty($cedula) || empty($nombre) || empty($apellido) || empty($telefono)) {
                http_response_code(400);
                echo json_encode(['error' => 'Todos los campos del chofer son obligatorios']);
                exit;
            }

            try {
                $traslado = new Traslado();
                $resultado = $traslado->crearChofer($cedula, $nombre, $apellido, $telefono);

                if ($resultado) {
                    http_response_code(201);
                    echo json_encode(['mensaje' => 'Chofer creado correctamente']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'No se pudo guardar el chofer']);
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
                echo json_encode(['error' => 'Debe proporcionar el ID del chofer en la URL']);
                exit;
            }
            $resultado = $traslado->eliminarChofer($id);
            if ($resultado) {
                http_response_code(200);
                echo json_encode(['mensaje' => 'Chofer eliminado correctamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo eliminar el chofer']);
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
