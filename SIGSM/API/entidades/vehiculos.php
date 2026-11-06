<?php
require_once __DIR__ . '/../../backend/models/Traslado.php';

header('Content-Type: application/json');
$metodo = $_SERVER['REQUEST_METHOD'];
$traslado = new Traslado();

try {
    switch ($metodo) {
        case 'GET':
            try {
                $vehiculos = $traslado->obtenerVehiculos();
                echo json_encode($vehiculos);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;
        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);

            $matricula = trim($datos['matricula'] ?? '');
            $modelo = trim($datos['modelo'] ?? '');
            $capacidad = trim($datos['capacidad'] ?? '');
            $tipo = trim($datos['tipo_vehiculo'] ?? '');

            if (empty($matricula) || empty($modelo) || empty($capacidad) || empty($tipo)) {
                http_response_code(400);
                echo json_encode(['error' => 'Todos los campos del vehículo son obligatorios']);
                exit;
            }

            try {
                $traslado = new Traslado();
                $resultado = $traslado->crearVehiculo($matricula, $modelo, $capacidad, $tipo);

                if ($resultado) {
                    http_response_code(201);
                    echo json_encode(['mensaje' => 'Vehículo creado correctamente']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'No se pudo guardar el vehículo']);
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
                echo json_encode(['error' => 'Debe proporcionar el ID del traslado en la URL']);
                exit;
            }

            $resultado = $traslado->eliminarVehiculo($id);

            if ($resultado) {
                http_response_code(200);
                echo json_encode(['mensaje' => 'Vehículo eliminado correctamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo eliminar el vehículo']);
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
