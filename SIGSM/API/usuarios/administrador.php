<?php

require_once __DIR__ . '/../../backend/models/Administrador.php';

$Administrador = new Administrador();

try {

    switch ($metodo) {
        case 'GET':
        if($id === null){
            $administradores= $Administrador->obtenerTodos();
            echo json_encode($administradores);
        }else{
            $administradores = $Administrador->obtenerPorCi($id);
            if($administradores === null){
                http_response_code(404);
                echo json_encode([
                    'error'=> 'Usuario No encontrado'
            ]);
            exit;
            }
            echo json_encode($administradores);
            } 
            
        exit;

        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);

            $ci = $datos['ci'];
            $nombre = $datos['nombre'];
            $apellido = $datos['apellido'];
            $pass = $datos['pass'];
            $cargo = $datos['cargo'];

            $resultado = $Administrador->crear(
                $ci,
                $nombre,
                $apellido,
                $password
            );
            if ($resultado){
                http_response_code(201);
                echo json_encode(['mensaje' => 'Usuario creado correctamente']);
            }else{
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo crear el usuario']);
            }
            exit;
        case 'PUT':
            
            exit;

        case 'DELETE':
            
            exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos']);
}
