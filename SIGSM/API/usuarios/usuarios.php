<?php

require_once __DIR__ . '/../../backend/models/Administrativo.php';
require_once __DIR__ . '/../../backend/models/Enfermero.php';

$Administrativo = new Administrativo();
$Enfermero = new Enfermero();

try {

    if ($metodo === 'GET') {

        $administrativos = $Administrativo->obtenerTodos();
        $enfermeros = $Enfermero->obtenerTodos();

        $usuarios = [];

        foreach ($administrativos as $administrativo) {
            $usuarios[] = [
                'ci' => $administrativo['Cedula_Administrativo'],
                'nombre' => $administrativo['Nombre_Administrativo'],
                'apellido' => $administrativo['Apellido_Administrativo'],
                'cargo' => $administrativo['Cargo'],
            ];
        }

        foreach ($enfermeros as $enfermero) {
            $usuarios[] = [
                'ci' => $enfermero['Cedula_Enfermero'],
                'nombre' => $enfermero['Nombre_Enfermero'],
                'apellido' => $enfermero['Apellido_Enfermero'],
                'cargo' => $enfermero['Cargo'],
            ];
        }

        echo json_encode($usuarios);
        exit;
    }
    if ($metodo === 'POST') {
        $datos = json_decode(file_get_contents('php://input'), true);

        if ($datos['cargo'] === 'Administrativo' || $datos['cargo'] === 'Admin') {
            $creado = $Administrativo->crear2($datos);
        } else {
            $creado = $Enfermero->crear2($datos);
        }

        if ($creado) {
            echo json_encode(['mensaje' => 'Usuario creado correctamente']);
        } else {
            echo json_encode(['error' => 'No se pudo crear el usuario']);
        }
        exit;
    }
    if ($metodo === 'DELETE') {
        $ci = $resource2;

        // Intenta borrar en Administrativo, si no borra ninguna fila, intenta en Enfermero
        if ($Administrativo->eliminar($ci) || $Enfermero->eliminar($ci)) {
            echo json_encode(['mensaje' => 'Usuario eliminado correctamente']);
        } else {
            echo json_encode(['error' => 'No se encontró ningún usuario con esa cédula']);
        }
        exit;
    }
} catch (PDOException $e) {
    // Muestra el error REAL de MySQL si la consulta está mal redactada
    http_response_code(500);
    echo json_encode(['error_sql' => $e->getMessage()]);
    exit;
}