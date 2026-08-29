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
                'rol' => $administrativo['Cargo'],
                'tipo' => 'Administrativo'
            ];
        }

        foreach ($enfermeros as $enfermero) {
            $usuarios[] = [
                'ci' => $enfermero['Cedula_Enfermero'],
                'nombre' => $enfermero['Nombre_Enfermero'],
                'apellido' => $enfermero['Apellido_Enfermero'],
                'rol' => $enfermero['Cargo'],
                'tipo' => 'Enfermero'
            ];
        }

        echo json_encode($usuarios);
        exit;
    }

    http_response_code(405);
    echo json_encode([
        'error' => 'Método no permitido'
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'error' => 'Error en la base de datos'
    ]);
}