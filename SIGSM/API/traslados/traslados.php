<?php

require_once __DIR__ . '/../../backend/models/Traslado.php';

$traslado = new Traslado();

try {

    switch ($metodo) {
        case 'GET':
            if (isset($_GET['recursos']) && $_GET['recursos'] === 'true') {
                $recursos = $traslado->obtenerDatosParaSelects();
                echo json_encode($recursos);
                exit;
            }

            if ($id === null) {
                $traslados = $traslado->obtenerTodos();
                echo json_encode($traslados);
            } else {
                $traslados = $traslado->obtenerPorId($id);
                if ($traslados === null) {
                    http_response_code(404);
                    echo json_encode([
                        'error' => 'Traslado No encontrado'
                    ]);
                    exit;
                }
                echo json_encode($traslados);
            }

            exit;

        case 'POST':
            $datos = json_decode(file_get_contents('php://input'), true);

            $tipoCarga = $datos['tipo_carga'] ?? 'paciente';

            $Fecha = $datos['fecha'] ?? '';
            $Hora_Salida = $datos['hora_salida'] ?? '';
            $Hora_Llegada = $datos['hora_llegada'] ?? '';
            $Estado = $datos['estado'] ?? 'En proceso';
            $Lugar_Origen = $datos['lugar_origen'] ?? '';
            $Cedula_Chofer = $datos['cedula_chofer'] ?? '';
            $Cedula_Enfermero = $datos['cedula_enfermero'] ?? '';
            $Matricula = $datos['matricula'] ?? '';
            $ID_Destino = $datos['id_destino'] ?? '';

            if ($tipoCarga === 'elemento') {
                $Nombre = $datos['nombre'] ?? '';
                $Descripcion = $datos['descripcion'] ?? '';
                $TipoElemento = $datos['tipo_elemento'] ?? '';

                if (empty($Nombre)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'El nombre del elemento es obligatorio']);
                    exit;
                }

                $resultado = $traslado->crearElemento(
                    $Fecha,
                    $Hora_Salida,
                    $Hora_Llegada,
                    $Estado,
                    $Lugar_Origen,
                    $Cedula_Chofer,
                    $Cedula_Enfermero,
                    $Matricula,
                    $ID_Destino,
                    $Nombre,
                    $Descripcion,
                    $TipoElemento
                );
            } else {
                $CI_Paciente = trim($datos['CI_Paciente'] ?? '');
                $Camilla = $datos['camilla'] ?? 'Normal';
                $Oxigeno = (isset($datos['oxigeno']) && ($datos['oxigeno'] === true || $datos['oxigeno'] === 'Sí' || $datos['oxigeno'] == 1)) ? 1 : 0;

                if (empty($CI_Paciente)) {
                    http_response_code(400);
                    echo json_encode(['error' => 'La cédula del paciente es obligatoria']);
                    exit;
                }

                $resultado = $traslado->crearPaciente(
                    $Fecha,
                    $Hora_Salida,
                    $Hora_Llegada,
                    $Estado,
                    $Lugar_Origen,
                    $Cedula_Chofer,
                    $Cedula_Enfermero,
                    $Matricula,
                    $ID_Destino,
                    $CI_Paciente,
                    $Camilla,
                    $Oxigeno
                );
            }

            if ($resultado) {
                http_response_code(201);
                echo json_encode(['mensaje' => 'Traslado creado correctamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'No se pudo crear el traslado']);
            }
            exit;

        case 'PUT':
            $datos = json_decode(file_get_contents('php://input'), true);
            if (!$datos) {
                http_response_code(400);
                echo json_encode(["error" => "Datos JSON inválidos o vacíos"]);
                exit;
            }

            if ($id === null) {
                http_response_code(400);
                echo json_encode(["error" => "Debe proporcionar el ID del traslado en la URL"]);
                exit;
            }

            $Fecha = $datos['fecha'] ?? null;
            $Hora_Salida = $datos['hora_salida'] ?? null;
            $Hora_Llegada = $datos['hora_llegada'] ?? null;
            $Estado = $datos['estado'] ?? null;
            $Lugar_Origen = $datos['lugar_origen'] ?? null;
            $Cedula_Chofer = $datos['cedula_chofer'] ?? null;
            $Cedula_Enfermero = $datos['cedula_enfermero'] ?? null;
            $Matricula = $datos['matricula'] ?? null;
            $ID_Destino = $datos['id_destino'] ?? null;

            if (is_null($Fecha) || is_null($Hora_Salida) || is_null($Hora_Llegada) || is_null($Estado) || is_null($Lugar_Origen) || is_null($Cedula_Chofer) || is_null($Cedula_Enfermero) || is_null($Matricula) || is_null($ID_Destino)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan campos obligatorios"]);
                exit;
            }

            $resultado = $traslado->actualizar(
                $id,
                $Fecha,
                $Hora_Salida,
                $Hora_Llegada,
                $Estado,
                $Lugar_Origen,
                $Cedula_Chofer,
                $Cedula_Enfermero,
                $Matricula,
                $ID_Destino
            );

            if ($resultado) {
                http_response_code(200);
                echo json_encode(["mensaje" => "Traslado actualizado correctamente"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "No se pudo actualizar el traslado"]);
            }
            exit;

        case 'DELETE':
            if ($id === null) {
                http_response_code(400);
                echo json_encode(['error' => 'Debe proporcionar el ID del traslado.']);
                exit;
            }
            $resultado = $traslado->eliminar($id);
            if ($resultado) {
                http_response_code(200);
                echo json_encode(["mensaje" => "Traslado eliminado correctamente"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "No se pudo eliminar el traslado"]);
            }
            exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error en la BD: ' . $e->getMessage(),
        'codigo' => $e->getCode()
    ]);
}
