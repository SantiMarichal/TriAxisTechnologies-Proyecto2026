<?php
require_once __DIR__ . '/../../backend/models/Encuesta.php';

$encuesta = new Encuesta();
$metodo = $_SERVER['REQUEST_METHOD'];

try {
    switch ($metodo) {
        case 'GET':
            $datosEncuesta = $encuesta->obtenerEncuestaGenerica();
            if ($datosEncuesta) {
                http_response_code(200);
                echo json_encode($datosEncuesta);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'No se encontró ninguna encuesta configurada']);
            }
            exit;

        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);

            if (!$datos || empty($datos['satisfaccion'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos incompletos o inválidos']);
                exit;
            }

            $resultado = $encuesta->guardarRespuesta(
                $datos['satisfaccion'],
                $datos['aspectos'] ?? []
            );

            if ($resultado) {
                http_response_code(201);
                echo json_encode(['mensaje' => 'Encuesta registrada correctamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo registrar la encuesta']);
            }
            exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos: ' . $e->getMessage()]);
}