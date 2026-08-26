<?php

require_once __DIR__ . '/../../backend/models/Administrativo.php';

$Administrativo = new Administrativo();

try {

    switch ($metodo) {
        // GET /api/usuarios/
        // GET /api/usuarios/12345678
        case 'GET':
        // GET /api/usuarios/
        if($id === null){
            $administrativos= $Administrativo->obtenerTodos();
            echo json_encode($administrativos);
        }else{
            $administrativos = $Administrativo->obtenerPorCi($id);
            if($administrativos === null){
                http_response_code(404);
                echo json_encode([
                    'error'=> 'Usuario No encontrado'
            ]);
            exit;
            }
            echo json_encode($administrativos);
            } 
            
        exit;

        case 'POST':
            //POST /api/usuarios/
            $datos = json_decode(file_get_contents('php://input'), true);

            $ci = $datos['ci'];
            $nombre = $datos['nombre'];
            $apellido = $datos['apellido'];
            $password = $datos['password'];
            $cargo = $datos['cargo'];

            $resultado = $Administrativo->crear(
                $ci,
                $nombre,
                $apellido,
                $password,
                $cargo
            );
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
