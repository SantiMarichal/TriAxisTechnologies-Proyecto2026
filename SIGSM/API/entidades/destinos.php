<?php
require_once __DIR__ . '/../../Backend/models/Traslado.php';

header('Content-Type: application/json');
$metodo = $_SERVER['REQUEST_METHOD'];
$traslado = new Traslado();

try {
    switch ($metodo) {
        case 'GET':
            try {
                $destinos = $traslado->obtenerDestinos();
                echo json_encode($destinos);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
            break;
        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);

            $nombre = trim($datos['nombre_destino'] ?? '');
            $direccion = trim($datos['direccion'] ?? '');
            $ruta = trim($datos['ruta'] ?? '');

            if (empty($nombre) || empty($direccion) || empty($ruta)) {
                http_response_code(400);
                echo json_encode(['error' => 'Todos los campos del destino son obligatorios']);
                exit;
            }

            try {
                $traslado = new Traslado();
                $resultado = $traslado->crearDestino($nombre, $direccion, $ruta);

                if ($resultado) {
                    http_response_code(201);
                    echo json_encode(['mensaje' => 'Destino creado correctamente']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'No se pudo guardar el destino']);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Error en la BD: ' . $e->getMessage()]);
            }
            break;
        case 'DELETE':
            $datos = json_decode(file_get_contents('php://input'), true);
            $id = trim($datos['id'] ?? '');

            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Identificador no proporcionado']);
                exit;
            }

            try {
                $resultado = $traslado->eliminarDestino($id);

                if ($resultado) {
                    echo json_encode(['mensaje' => 'Registro eliminado correctamente']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'No se pudo eliminar el registro']);
                }
            } catch (Exception $e) {
                http_response_code(400); // Atrapa la validación de que tiene traslados asociados
                echo json_encode(['error' => $e->getMessage()]);
            }
            exit;
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error general: ' . $e->getMessage()]);
}
