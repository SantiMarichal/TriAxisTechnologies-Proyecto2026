<?php
require_once __DIR__ . '/../config/Database.php';

class Documento
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::getInstancia()->getConexion();
    }

    public function listar(?string $ciUsuario = null): array
    {
        if ($ciUsuario !== null && $ciUsuario !== '') {
            $sql = "SELECT ID_Documento, CI_Usuario, Titulo, Descripcion, ID_Categoria, Estado, Nombre_archivo, Ruta_archivo 
                    FROM Documentos 
                    WHERE CI_Usuario = :ci 
                    ORDER BY ID_Documento DESC";
            $stmt = $this->conexion->prepare($sql);
            $stmt->bindParam(':ci', $ciUsuario);
            $stmt->execute();
        } else {
            $sql = "SELECT ID_Documento, CI_Usuario, Titulo, Descripcion, ID_Categoria, Estado, Nombre_archivo, Ruta_archivo 
                    FROM Documentos 
                    ORDER BY ID_Documento DESC";
            $stmt = $this->conexion->query($sql);
        }

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function crearConArchivo(string $titulo, string $descripcion, string $id_categoria, string $estado, ?string $ciUsuario, string $nombreArchivo, string $rutaArchivo): bool
    {
        $sql = 'INSERT INTO Documentos (Titulo, Descripcion, ID_Categoria, Estado, CI_Usuario, Nombre_archivo, Ruta_archivo) 
                VALUES (:titulo, :descripcion, :id_categoria, :estado, :ci_usuario, :nombre_archivo, :ruta_archivo)';

        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(':titulo', $titulo);
        $sentencia->bindParam(':descripcion', $descripcion);
        $sentencia->bindParam(':id_categoria', $id_categoria);
        $sentencia->bindParam(':estado', $estado);
        $sentencia->bindParam(':ci_usuario', $ciUsuario);
        $sentencia->bindParam(':nombre_archivo', $nombreArchivo);
        $sentencia->bindParam(':ruta_archivo', $ruta_archivo); 
        
        return $sentencia->execute();
    }

    public function buscarPorID(string $id_documento): ?array
    {
        $sql = 'SELECT * FROM Documentos WHERE ID_Documento = :id_documento';
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":id_documento", $id_documento);
        $sentencia->execute();

        return ($sentencia->fetch(PDO::FETCH_ASSOC)) ?: null;
    }

    public function actualizar(string $id_documento, string $titulo, string $descripcion, string $id_categoria, string $estado): bool
    {
        $sql = 'UPDATE Documentos SET Titulo = :titulo, Descripcion = :descripcion, ID_Categoria = :id_categoria, Estado = :estado WHERE ID_Documento = :id_documento';
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":id_documento", $id_documento);
        $sentencia->bindParam(":titulo", $titulo);
        $sentencia->bindParam(":descripcion", $descripcion);
        $sentencia->bindParam(":id_categoria", $id_categoria);
        $sentencia->bindParam(":estado", $estado);
        return $sentencia->execute();
    }

    public function eliminar(string $id_documento): bool
    {
        $sqlCarga = "DELETE FROM Carga WHERE ID_Documento = :id_documento";
        $sentenciaCarga = $this->conexion->prepare($sqlCarga);
        $sentenciaCarga->bindParam(":id_documento", $id_documento);
        $sentenciaCarga->execute();

        $sql = "DELETE FROM Documentos WHERE ID_Documento = :id_documento";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":id_documento", $id_documento);
        
        if ($sentencia->execute()) {
            return $sentencia->rowCount() > 0;
        }
        return false;
    }
}