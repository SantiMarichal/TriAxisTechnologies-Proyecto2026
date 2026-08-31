<?php

require_once __DIR__ . '/../../backend/models/Administrativo.php';
require_once __DIR__ . '/../../backend/models/Enfermero.php';
require_once __DIR__ . '/../../backend/models/Administrador.php';

$administrativo = new Administrativo();
$enfermero = new Enfermero();
$administrador = new Administrador();

try {

    if ($metodo === 'GET') {

        $administrativos = $administrativo->obtenerTodos();
        $enfermeros = $enfermero->obtenerTodos();
        $administradores = $administrador->obtenerTodos();

        $usuarios = [];

        foreach ($administrativos as $administrativo) {
            $usuarios[] = [
                'ci' => $administrativo['Cedula_Administrativo'],
                'nombre' => $administrativo['Nombre_Administrativo'],
                'apellido' => $administrativo['Apellido_Administrativo'],
                'cargo' => $administrativo['Cargo'],
                'pass' => $administrativo['Contrasena'],
                'rolBase' => 'Administrativo'
            ];
        }

        foreach ($enfermeros as $enfermero) {
            $usuarios[] = [
                'ci' => $enfermero['Cedula_Enfermero'],
                'nombre' => $enfermero['Nombre_Enfermero'],
                'apellido' => $enfermero['Apellido_Enfermero'],
                'cargo' => $enfermero['Cargo'],
                'pass' => $enfermero['Contrasena'],
                'rolBase' => 'Enfermero'
            ];
        }

        foreach ($administradores as $administrador) {
            $usuarios[] = [
                'ci' => $administrador['Cedula_Administrador'],
                'nombre' => $administrador['Nombre_Administrador'],
                'apellido' => $administrador['Apellido_Administrador'],
                'cargo' => $administrador['Cargo'],
                'pass' => $administrador['Contrasena'],
                'rolBase' => 'Administrador'
            ];
        }

        echo json_encode($usuarios);
        exit;
    }
    if ($metodo === 'POST') {
        $datos = json_decode(file_get_contents('php://input'), true);

        if ($datos['cargo'] === 'Administrativo' || $datos['cargo'] === 'Admin') {
            $creado = $administrativo->crear2($datos);
        } else if ($datos['cargo' === 'Enfermero']) {
            $creado = $enfermero->crear2($datos);
        } else if ($datos['cargo'] === 'Administrador') {
            $creado = $administrador->crear2($datos);
        } else {
            $creado = false;
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
        if ($administrativo->eliminar($ci) || $enfermero->eliminar($ci) || $administrador->eliminar($ci)) {
            echo json_encode(['mensaje' => 'Usuario eliminado correctamente']);
        } else {
            echo json_encode(['error' => 'No se encontró ningún usuario con esa cédula']);
        }
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error_sql' => $e->getMessage()]);
    exit;
}