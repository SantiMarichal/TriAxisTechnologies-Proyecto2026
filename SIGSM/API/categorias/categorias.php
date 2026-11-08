<?php

require_once __DIR__ . '/../../Backend/models/Categoria.php';

$categoria = new Categoria();

try {
    switch ($metodo) {
        case 'GET':
            $categorias = $categoria->obtenerTodas();
            echo json_encode($categorias);
            break;
        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);
            $nombre = $datos['nombre'] ?? null;
            $resultado = $categoria->crear($nombre);
            if ($resultado) {
                http_response_code(201);
                echo json_encode(['mensaje' => 'Categoría creada exitosamente']);
            } else {
                http_response_code(400);
                echo json_encode(['mensaje' => 'Error al crear la categoría']);
            }
            break;
        case 'DELETE':
            if ($id) {
                $resultado = $categoria->eliminar((int) $id);
                if ($resultado) {
                    http_response_code(200);
                    echo json_encode(['mensaje' => 'Categoría eliminada exitosamente']);
                } else {
                    http_response_code(400);
                    echo json_encode(['mensaje' => 'No se pudo eliminar la categoría o no existe']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['mensaje' => 'ID de categoría no proporcionado en la ruta']);
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(['mensaje' => 'Método no permitido']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['mensaje' => 'Error en el servidor: ' . $e->getMessage()]);
}