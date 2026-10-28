<?php

require_once __DIR__ . '/../../backend/models/Encuesta.php';

$Encuesta = new Encuesta();
$metodo = $_SERVER['REQUEST_METHOD'];

try {
    switch ($metodo) {
        case 'GET':
            $idCategoria = isset($_GET['categoria']) ? $_GET['categoria'] : 1;
            
            $datosEncuesta = $Encuesta->obtenerPorCategoria($idCategoria);

            if ($datosEncuesta) {
                http_response_code(200);
                echo json_encode($datosEncuesta);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'No se encontró ninguna encuesta para esta categoría']);
            }
            exit;

        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);

            if (!$datos) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos inválidos']);
                exit;
            }

            $respuestas = $datos['respuestas'] ?? [];

            $resultado = $Encuesta->guardarRespuestasEncuesta($respuestas);

            if ($resultado) {
                http_response_code(201);
                echo json_encode(['mensaje' => 'Encuesta procesada correctamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo procesar la encuesta']);
            }

            exit;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos: ' . $e->getMessage()]);
}