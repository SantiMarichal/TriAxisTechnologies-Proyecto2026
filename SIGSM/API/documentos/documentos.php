<?php

require_once __DIR__ . '/../../backend/models/Documento.php';

$documento = new Documento();

try {

    switch ($metodo) {
        case 'GET':
            if ($id === null) {
                $documentos = $documento->obtenerTodos();
                echo json_encode($documentos);
            } else {
                $documentos = $documento->obtenerPorID($id);
                if ($documentos === null) {
                    http_response_code(404);
                    echo json_encode([
                        'error' => 'Documento No encontrado'
                    ]);
                    exit;
                }
                echo json_encode($documentos);
            }

            exit;

        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);

            $id_documento = $datos['id_documento'];
            $titulo = $datos['titulo'];
            $descripcion = $datos['descripcion'];
            $id_categoria = $datos['id_categoria'];
            $estado = $datos['estado'];

            $resultado = $documento->crear(
                $id_documento,
                $titulo,
                $descripcion,
                $id_categoria,
                $estado
            );
            if ($resultado) {
                http_response_code(201);
                echo json_encode(['mensaje' => 'Documento creado correctamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo crear el documento']);
            }
            exit;
        case 'PUT':
            $datos = json_decode(file_get_contents('php://input'), true);
            if (!$datos) {
                http_response_code(400);
                echo json_encode(["error" => "Datos JSON inválidos o vacíos"]);
                exit;
            }

            $id_documento = $datos['id_documento'] ?? null;
            $titulo = $datos['titulo'] ?? null;
            $descripcion = $datos['descripcion'] ?? null;
            $id_categoria = $datos['id_categoria'] ?? null;
            $estado = $datos['estado'] ?? null;

            if (!$id_documento || !$titulo || !$descripcion || !$id_categoria || !$estado) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan campos obligatorios"]);
                exit;
            }

            $resultado = $documento->actualizar(
                $id_documento,
                $titulo,
                $descripcion,
                $id_categoria,
                $estado
            );

            if ($resultado) {
                http_response_code(200);
                echo json_encode(["mensaje" => "Documento actualizado correctamente"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "No se pudo actualizar el documento"]);
            }
            exit;

        case 'DELETE':
            if ($id === null) {
                http_response_code(400);
                echo json_encode(['error' => 'Debe proporcionar el ID del documento.']);
                exit;
            }
            $resultado = $documento->eliminar($id);
            if ($resultado) {
                http_response_code(200);
                echo json_encode(["mensaje" => "Documento eliminado correctamente"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "No se pudo eliminar el documento"]);
            }
            exit;
            exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos']);
}
