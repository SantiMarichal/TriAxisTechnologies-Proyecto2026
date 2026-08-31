<?php
require_once __DIR__ . '/../../backend/models/Administrativo.php';

$administrativo = new Administrativo();

try {

    switch ($metodo) {
        case 'GET':
            if ($id === null) {
                $administrativos = $administrativo->obtenerTodos();
                echo json_encode($administrativos);
            } else {
                $administrativos = $administrativo->obtenerPorCi($id);
                if ($administrativos === null) {
                    http_response_code(404);
                    echo json_encode([
                        'error' => 'Usuario No encontrado'
                    ]);
                    exit;
                }
                echo json_encode($administrativos);
            }
            exit;

        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);

            $ci = $datos['ci'];
            $nombre = $datos['nombre'];
            $apellido = $datos['apellido'];
            $pass = $datos['pass'];
            $cargo = $datos['cargo'];

            $resultado = $administrativo->crear(
                $ci,
                $nombre,
                $apellido,
                $pass,
                $cargo
            );
            if ($resultado) {
                http_response_code(201);
                echo json_encode(['mensaje' => 'Usuario creado correctamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo crear el usuario']);
            }
            exit;
        case 'PUT':
            $datos = json_decode(file_get_contents('php://input'), true);
            if (!$datos) {
                http_response_code(400);
                echo json_encode(["error" => "Datos JSON inválidos o vacíos"]);
                exit;
            }

            $ci = $datos['ci'] ?? null;
            $nombre = $datos['nombre'] ?? null;
            $apellido = $datos['apellido'] ?? null;
            $cargo = $datos['cargo'] ?? null;
            $pass = $datos['pass'] ?? null;

            if (!$ci || !$nombre || !$apellido || !$cargo || !$pass) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan campos obligatorios"]);
                exit;
            }

            $resultado = $administrativo->actualizar(
                $ci,
                $nombre,
                $apellido,
                $cargo,
                $pass
            );

            if ($resultado) {
                http_response_code(200);
                echo json_encode(["mensaje" => "Usuario actualizado correctamente"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "No se pudo actualizar el usuario"]);
            }
            exit;
        case 'DELETE':

            exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos']);
}
