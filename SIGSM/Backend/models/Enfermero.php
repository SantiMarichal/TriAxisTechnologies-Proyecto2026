<?php
require_once __DIR__ . '/../config/Database.php';

class Enfermero
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::getInstancia()->getConexion();
    }

    public function crear(string $ci, string $nombre, string $apellido, string $pass, string $cargo): bool {
        $sql = 'INSERT INTO Enfermero(Cedula_Enfermero, Nombre_Enfermero, Apellido_Enfermero, Contrasena, Cargo) VALUES (:ci, :nombre, :apellido, :pass, :cargo)';

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
       $sql = 'SELECT * FROM Enfermero';
        //Preparamos la sentencia
       $sentencia = $this->conexion->prepare($sql);

       //Ejecutamos la consulta
       $sentencia->execute();

        //Retornamos un array asociativo (FETCH_ASSOC)
       return $sentencia->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener usuario por CI
    public function obtenerPorCi(string $ci): ?array {

        $sql = 'SELECT * FROM Enfermero WHERE Cedula_Enfermero=:ci'; //ci es un parametro de la query
        
        $sentencia = $this->conexion->prepare($sql);

        $sentencia->bindParam(":ci", $ci);

        $sentencia->execute();

        return ($sentencia->fetch(PDO::FETCH_ASSOC)) ?: null;
    }



    // Modificar usuario
    public function actualizar(string $ci, string $nombre, string $apellido, string $user, string $rol): bool {
        
    }

    // Eliminar usuario
    public function eliminar(string $ci): bool {
        $sql = "DELETE FROM Enfermero WHERE Cedula_Enfermero = :ci";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":ci", $ci);
        if ($sentencia->execute()) {
        return $sentencia->rowCount() > 0; // Devuelve true si se borro alguna fila
        }
        return false;
    }

    // LOGIN
    public function login(string $ci, string $nombre, string $pass): ?array {
        $sql = 'SELECT * FROM Enfermero WHERE Cedula_Enfermero=:ci AND Nombre_Enfermero=:nombre AND Contrasena=:pass';
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":ci", $ci);
        $sentencia->bindParam(":nombre", $nombre);
        $sentencia->bindParam(":pass", $pass);
        $sentencia->execute();
        $administrativo = ($sentencia->fetch(PDO::FETCH_ASSOC)) ?: null;
        return $administrativo ?: null;
    }
}