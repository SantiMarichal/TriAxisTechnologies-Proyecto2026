<?php

header("X-Content-Type-Options: nosniff");

require_once __DIR__ . '/../../backend/models/Documento.php';

$documento = new Documento();
$raizProyecto = dirname(__DIR__);
$tamañoMaximo = 10 * 1024 * 1024; // 10 MB de tamaño máximo

// Se estandariza response con función
function responderJson(array $datos, int $codigo = 200): void
{
    http_response_code($codigo);

    header("Content-Type: application/json; charset=utf-8");

    echo json_encode($datos);

    exit;
}


function resolverRutaArchivo(string $rutaRelativa, string $raizProyecto): ?string
{
    $raizUploads = realpath($raizProyecto . "/uploads/pdf");

    if ($raizUploads === false) {
        return null;
    }

    $rutaRelativa = str_replace(
        ["\\", "/"],
        DIRECTORY_SEPARATOR,
        $rutaRelativa
    );

    $rutaFisica = realpath($raizProyecto . DIRECTORY_SEPARATOR . $rutaRelativa);

    if ($rutaFisica === false) {
        return null;
    }

    $prefijo = $raizUploads . DIRECTORY_SEPARATOR;

    if (strpos($rutaFisica, $prefijo) !== 0) {
        return null;
    }

    return $rutaFisica;
}


switch ($metodo) {
    case 'GET':
        $idDocumento = isset($id) && is_numeric($id) ? $id : null;

        if ($idDocumento !== null) {
            $documentoInfo = $documento->buscarPorID($idDocumento);

            if ($documentoInfo === null) {
                responderJson([
                    "error" => "Documento no encontrado"
                ], 404);
            }

            if (empty($documentoInfo["ruta_archivo"])) {
                responderJson([
                    "error" => "Este documento no tiene un archivo PDF asociado"
                ], 404);
            }

            $rutaFisica = resolverRutaArchivo(
                $documentoInfo["ruta_archivo"],
                $raizProyecto
            );

            if ($rutaFisica === null || !is_file($rutaFisica) || !is_readable($rutaFisica)) {
                responderJson([
                    "error" => "El archivo no existe o no se puede leer en el servidor"
                ], 404);
            }

            $nombreArchivo = str_replace(["\r", "\n", '"', "\\"], "_", basename($documentoInfo["nombre_archivo"]));

            header("Content-Type: application/pdf");
            header('Content-Disposition: inline; filename="' . $nombreArchivo . '"');
            header("Content-Length: " . filesize($rutaFisica));

            readfile($rutaFisica);
            exit;
        }
        $documentos = $documento->listar();
        responderJson($documentos);
        exit;

    case 'POST':
        $usuarioCI = isset($_POST["usuarioCI"]) ? trim((string) $_POST["usuarioCI"]) : "";
        $titulo = isset($_POST["titulo"]) ? trim((string) $_POST["titulo"]) : "";
        $descripcion = isset($_POST["descripcion"]) ? trim((string) $_POST["descripcion"]) : "";
        $id_categoria = isset($_POST["id_categoria"]) ? trim((string) $_POST["id_categoria"]) : "";
        $estado = isset($_POST["estado"]) ? trim((string) $_POST["estado"]) : "";

        if ($titulo === "") {
            responderJson([
                "error" => "Debe indicar el Título del documento"
            ], 400);
        }

        // Se comprueba si en body.archivo se recibe archivo
        if (!isset($_FILES["archivo"])) {
            responderJson([
                "error" => "No se recibió ningún archivo"
            ], 400);
        }

        $archivo = $_FILES["archivo"];
        /*
            [
                "name" => "contrato.pdf",
                "type" => "application/pdf",
                "tmp_name" => "/tmp/phpABC123",
                "error" => 0,
                "size" => 245760
            ]
            tmp_name: el archivo aún no está uploads/pdf/2026/. PHP lo almacena temporalmente mientras procesa la petición
        */

        if ($archivo["error"] !== UPLOAD_ERR_OK) {
            responderJson([
                "error" => "Se produjo un error al subir el archivo"
            ], 400);
        }

        // Se comprueba que el archivo temporal (recordar tmp_name) sea válido
        if (!is_uploaded_file($archivo["tmp_name"]) || $archivo["size"] <= 0) {
            responderJson([
                "error" => "El archivo recibido no es válido"
            ], 400);
        }

        // Se comprueba tamaño del archivo
        if ($archivo["size"] > $tamañoMaximo) {
            responderJson([
                "error" => "El archivo supera el límite de 10 MB"
            ], 400);
        }

        // Se comprueba que el archivo sea PDF
        $finfo = finfo_open(FILEINFO_MIME_TYPE); // MIME: application/pdf, image/png, image/jpeg o text/plain

        $tipoMime = finfo_file($finfo, $archivo["tmp_name"]);

        $handle = fopen($archivo["tmp_name"], "rb");
        $cabecera = fread($handle, 5); // Se leen los primeros caracteres de un PDF %PDF- (abrir un PDF con editor de texto)
        fclose($handle);

        // Recién acá se realiza la comprobación
        if ($tipoMime !== "application/pdf" || $cabecera !== "%PDF-") {
            responderJson([
                "error" => "El archivo debe ser un PDF válido"
            ], 400);
        }


        // Nombre del archivo ---INICIO------------------------------------------------------
        // Se obtiene el nombre original y se crea el nombre aleatorio para guardar en el srv
        $nombreOriginal = basename(str_replace("\\", "/", $archivo["name"]));

        $nombreOriginal = preg_replace('/[\x00-\x1F\x7F]/', "", $nombreOriginal);
        // Eliminamos caracteres especiales mediante expresión regular, como los de control \x00-\x1F y \x7F

        if ($nombreOriginal === "") {
            $nombreOriginal = "documento.pdf";
        }

        if (function_exists("mb_substr")) {
            // Con codificación, en este caso UTF-8 (letras acentuadas u otros caracteres)
            $nombreOriginal = mb_substr($nombreOriginal, 0, 255, "UTF-8");
        } else {
            // Sin codificación. No Unicode
            $nombreOriginal = substr($nombreOriginal, 0, 255);
        }

        $nombreServidor = bin2hex(random_bytes(16)) . ".pdf";
        // Nombre del archivo ---FIN------------------------------------------------------

        // Se crea la carpeta con el año, si es que ya no existe ---INICIO----------------
        $anio = date("Y");

        $carpetaRelativa = "uploads/pdf/" . $anio;

        $carpetaFisica = $raizProyecto . DIRECTORY_SEPARATOR . str_replace("/", DIRECTORY_SEPARATOR, $carpetaRelativa);

        if (!is_dir($carpetaFisica) && !mkdir($carpetaFisica, 0777, true) && !is_dir($carpetaFisica)) {
            responderJson([
                "error" => "No se pudo crear la carpeta de destino"
            ], 500);
        }
        // Se crea la carpeta con el año, si es que ya no existe ---FIN-------------------


        // El archivo queda en el srv en uploads/pdf/año/
        $rutaRelativa = $carpetaRelativa . "/" . $nombreServidor;

        $rutaFisica = $carpetaFisica . DIRECTORY_SEPARATOR . $nombreServidor;

        if (!move_uploaded_file($archivo["tmp_name"], $rutaFisica)) {
            responderJson([
                "error" => "No se pudo guardar el archivo en el servidor"
            ], 500);
        }

        // Se guarda el PDF y los datos de tu tabla Documentos en la BD
        try {
            // Usamos el método adaptado para recibir tanto los campos de SIGSM como la ruta del PDF
            $resultado = $documento->crearConArchivo(
                $titulo,
                $descripcion,
                $id_categoria,
                $estado,
                $usuarioCI !== "" ? $usuarioCI : null,
                $nombreOriginal,
                $rutaRelativa   
            );
        } catch (Throwable $e) {
            if (is_file($rutaFisica)) {
                // Si se genera una excepción se borra el PDF
                unlink($rutaFisica);
            }

            error_log($e->getMessage());

            responderJson([
                "error" => "No se pudo registrar el documento"
            ], 500);
        }


        responderJson([
            "mensaje" => "PDF subido correctamente",
            "nombre_archivo" => $nombreOriginal,
            "ruta_archivo" => $rutaRelativa
        ], 201);

        break;

    case 'DELETE':
        $idDocumento = isset($id) ? $id : null;

        if (!isset($idDocumento)) {
            responderJson([
                "error" => "Debe indicar el ID del documento"
            ], 400);
        }

        $documentoInfo = $documento->buscarPorID($idDocumento);

        if ($documentoInfo === null) {
            responderJson([
                "error" => "Documento no encontrado"
            ], 404);
        }

        if (isset($documentoInfo["ruta_archivo"]) && !empty($documentoInfo["ruta_archivo"])) {
            $rutaFisica = resolverRutaArchivo(
                $documentoInfo["ruta_archivo"],
                $raizProyecto
            );

            if ($rutaFisica !== null && is_file($rutaFisica) && !unlink($rutaFisica)) {
                responderJson([
                    "error" => "No se pudo eliminar el archivo físico"
                ], 500);
            }
        }

        // Borramos el registro de la base de datos de todas formas
        $eliminado = $documento->eliminar($idDocumento);

        if (!$eliminado) {
            responderJson([
                "error" => "No se pudo eliminar el registro"
            ], 500);
        }

        responderJson([
            "mensaje" => "Documento eliminado correctamente"
        ]);

        break;

    default:
        responderJson([
            "error" => "Método HTTP no permitido"
        ], 405);
}