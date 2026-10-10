<?php
require_once __DIR__ . '/../config/Database.php';

class Documento
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::getInstancia()->getConexion();
    }

    public function crear(string $id_documento, string $titulo, string $descripcion, string $id_categoria, string $estado): bool
    {
        $sql = 'INSERT INTO Documentos(Id_Documento, Titulo, Descripcion, Id_Categoria, Estado) VALUES (:id_documento, :titulo, :descripcion, :id_categoria, :estado)';

        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(':id_documento', $id_documento);
        $sentencia->bindParam(':titulo', $titulo);
        $sentencia->bindParam(':descripcion', $descripcion);
        $sentencia->bindParam(':id_categoria', $id_categoria);
        $sentencia->bindParam(':estado', $estado);
        return $sentencia->execute();
    }

    public function crear2(array $datos): bool
    {
        return $this->crear(
            $datos['id_documento'],
            $datos['titulo'],
            $datos['descripcion'],
            $datos['id_categoria'],
            $datos['estado']
        );
    }

    // Obtener todos los documentos
    public function obtenerTodos(): array
    {  
        $sql = 'SELECT * FROM Documentos';
        $sentencia = $this->conexion->prepare($sql);

        $sentencia->execute();

        return $sentencia->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener usuario por CI
    public function obtenerPorID(string $id_documento): ?array
    {

        $sql = 'SELECT * FROM Documentos WHERE Id_Documento=:id_documento'; 

        $sentencia = $this->conexion->prepare($sql);

        $sentencia->bindParam(":id_documento", $id_documento);

        $sentencia->execute();

        return ($sentencia->fetch(PDO::FETCH_ASSOC)) ?: null;
    }



    // Modificar usuario
    public function actualizar(string $id_documento, string $titulo, string $descripcion, string $id_categoria, string $estado): bool
    {
        $sql = 'UPDATE Documentos SET Titulo=:titulo, Descripcion=:descripcion, Id_Categoria=:id_categoria, Estado=:estado WHERE Id_Documento=:id_documento';
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":id_documento", $id_documento);
        $sentencia->bindParam(":titulo", $titulo);
        $sentencia->bindParam(":descripcion", $descripcion);
        $sentencia->bindParam(":id_categoria", $id_categoria);
        $sentencia->bindParam(":estado", $estado);
        return $sentencia->execute();
    }

    // Eliminar usuario
    public function eliminar(string $id_documento): bool
    {
        $sql = "DELETE FROM Documentos WHERE Id_Documento = :id_documento";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":id_documento", $id_documento);
        if ($sentencia->execute()) {
            return $sentencia->rowCount() > 0; // Devuelve true si se borro alguna fila
        }
        return false;
    }
}