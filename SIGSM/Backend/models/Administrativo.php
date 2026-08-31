<?php
require_once __DIR__ . '/../config/Database.php';

class Administrativo
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::getInstancia()->getConexion();
    }

    public function crear(string $ci, string $nombre, string $apellido, string $pass, string $cargo): bool {
        $sql = 'INSERT INTO Administrativo(Cedula_Administrativo, Nombre_Administrativo, Apellido_Administrativo, Contrasena, Cargo) VALUES (:ci, :nombre, :apellido, :pass, :cargo)';

        $sentencia = $this->conexion->prepare($sql);

        $sentencia -> bindParam(':ci', $ci);
        $sentencia -> bindParam(':nombre', $nombre);
        $sentencia -> bindParam(':apellido', $apellido);
        $sentencia -> bindParam(':pass', $pass);
        $sentencia -> bindParam(':cargo', $cargo);
        return $sentencia -> execute();
    }

    public function crear2(array $datos): bool {
    return $this->crear(
        $datos['ci'],
        $datos['nombre'],
        $datos['apellido'],
        $datos['pass'],
        $datos['cargo']
    );
}

    // Obtener todos los usuarios
    public function obtenerTodos(): array {
    // Escribimos como texto literal la consulta SQL    
       $sql = 'SELECT * FROM Administrativo';
        //Preparamos la sentencia
       $sentencia = $this->conexion->prepare($sql);

       //Ejecutamos la consulta
       $sentencia->execute();

        //Retornamos un array asociativo (FETCH_ASSOC)
       return $sentencia->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener usuario por CI
    public function obtenerPorCi(string $ci): ?array {

        $sql = 'SELECT * FROM Administrativo WHERE Cedula_Administrativo=:ci'; //ci es un parametro de la query
        
        $sentencia = $this->conexion->prepare($sql);

        $sentencia->bindParam(":ci", $ci);

        $sentencia->execute();

        return ($sentencia->fetch(PDO::FETCH_ASSOC)) ?: null;
    }



    // Modificar usuario
    public function actualizar(string $ci, string $nombre, string $apellido, string $cargo, string $pass): bool {
        $sql = 'UPDATE Administrativo SET Nombre_Administrativo=:nombre, Apellido_Administrativo=:apellido, Contrasena=:pass, Cargo=:cargo WHERE Cedula_Administrativo=:ci';
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":ci", $ci);
        $sentencia->bindParam(":nombre", $nombre);
        $sentencia->bindParam(":apellido", $apellido);
        $sentencia->bindParam(":pass", $pass);
        $sentencia->bindParam(":cargo", $cargo);
        return $sentencia->execute();
    }

    // Eliminar usuario
    public function eliminar(string $ci): bool {
        $sqlDocs = "DELETE FROM Documentos WHERE Cedula_Administrativo = :ci";
    $sentenciaDocs = $this->conexion->prepare($sqlDocs);
    $sentenciaDocs->bindParam(":ci", $ci);
    $sentenciaDocs->execute();

    $sql = "DELETE FROM Administrativo WHERE Cedula_Administrativo = :ci";
    $sentencia = $this->conexion->prepare($sql);
    $sentencia->bindParam(":ci", $ci);
    
    if ($sentencia->execute()) {
        return $sentencia->rowCount() > 0;
    }
    return false;
    }

    // LOGIN
    public function login(string $ci, string $nombre, string $pass): ?array {
        $sql = 'SELECT * FROM Administrativo WHERE Cedula_Administrativo=:ci AND Nombre_Administrativo=:nombre AND Contrasena=:pass';
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":ci", $ci);
        $sentencia->bindParam(":nombre", $nombre);
        $sentencia->bindParam(":pass", $pass);
        $sentencia->execute();
        $administrativo = ($sentencia->fetch(PDO::FETCH_ASSOC)) ?: null;
        return $administrativo ?: null;
    }
}