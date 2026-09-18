<?php
require_once __DIR__ . '/../config/Database.php';

class Traslado
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::getInstancia()->getConexion();
    }

    public function crear(string $fecha, string $Hora_Salida, string $Hora_Llegada, string $Estado, string $Lugar_Origen, string $Cedula_Chofer, string $Cedula_Enfermero, string $Matricula, string $ID_Destino): bool
    {
        $sql = 'INSERT INTO Traslado(Fecha, Hora_Salida, Hora_Llegada, Estado, Lugar_Origen, Cedula_Chofer, Cedula_Enfermero, Matricula, ID_Destino) VALUES (:fecha, :hora_salida, :hora_llegada, :estado, :lugar_origen, :cedula_chofer, :cedula_enfermero, :matricula, :id_destino)';

        $sentencia = $this->conexion->prepare($sql);

        $sentencia->bindParam(':fecha', $fecha);
        $sentencia->bindParam(':hora_salida', $Hora_Salida);
        $sentencia->bindParam(':hora_llegada', $Hora_Llegada);
        $sentencia->bindParam(':estado', $Estado);
        $sentencia->bindParam(':lugar_origen', $Lugar_Origen);
        $sentencia->bindParam(':cedula_chofer', $Cedula_Chofer);
        $sentencia->bindParam(':cedula_enfermero', $Cedula_Enfermero);
        $sentencia->bindParam(':matricula', $Matricula);
        $sentencia->bindParam(':id_destino', $ID_Destino);
        return $sentencia->execute();
    }

    // Obtener todos los usuarios
    public function obtenerTodos(): array
    {
        // Escribimos como texto literal la consulta SQL    
        $sql = 'SELECT Traslado.*, Tipo_vehiculo 
            FROM Traslado 
            INNER JOIN Vehiculo ON Traslado.Matricula = Vehiculo.Matricula';
        //Preparamos la sentencia
        $sentencia = $this->conexion->prepare($sql);

        //Ejecutamos la consulta
        $sentencia->execute();

        //Retornamos un array asociativo (FETCH_ASSOC)
        return $sentencia->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener usuario por CI
    public function obtenerPorId(string $id): ?array
    {

        $sql = 'SELECT * FROM Traslado WHERE ID_Traslado =:id'; //id es un parametro de la query

        $sentencia = $this->conexion->prepare($sql);

        $sentencia->bindParam(":id", $id);

        $sentencia->execute();

        return ($sentencia->fetch(PDO::FETCH_ASSOC)) ?: null;
    }



    // Modificar usuario
    public function actualizar(string $id, string $fecha, string $Hora_Salida, string $Hora_Llegada, string $Estado, string $Lugar_Origen, string $Cedula_Chofer, string $Cedula_Enfermero, string $Matricula, string $ID_Destino): bool
    {
        $sql = 'UPDATE Traslado SET Fecha=:fecha, Hora_Salida=:hora_salida, Hora_Llegada=:hora_llegada, Estado=:estado, Lugar_Origen=:lugar_origen, Cedula_Chofer=:cedula_chofer, Cedula_Enfermero=:cedula_enfermero, Matricula=:matricula, ID_Destino=:id_destino WHERE ID_Traslado=:id';
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":id", $id);
        $sentencia->bindParam(":fecha", $fecha);
        $sentencia->bindParam(":hora_salida", $Hora_Salida);
        $sentencia->bindParam(":hora_llegada", $Hora_Llegada);
        $sentencia->bindParam(":estado", $Estado);
        $sentencia->bindParam(":lugar_origen", $Lugar_Origen);
        $sentencia->bindParam(":cedula_chofer", $Cedula_Chofer);
        $sentencia->bindParam(":cedula_enfermero", $Cedula_Enfermero);
        $sentencia->bindParam(":matricula", $Matricula);
        $sentencia->bindParam(":id_destino", $ID_Destino);
        return $sentencia->execute();
    }

    // Eliminar usuario
    public function eliminar(string $id): bool
    {
        $sql = "DELETE FROM Traslado WHERE ID_Traslado = :id";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":id", $id);

        if ($sentencia->execute()) {
            return $sentencia->rowCount() > 0;
        }
        return false;
    }
}