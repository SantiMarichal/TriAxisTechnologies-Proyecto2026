<?php
require_once __DIR__ . '/../config/Database.php';

class Traslado
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::getInstancia()->getConexion();
    }

    public function crearPaciente(
        string $fecha,
        string $Hora_Salida,
        string $Hora_Llegada,
        string $Estado,
        string $Lugar_Origen,
        string $Cedula_Chofer,
        string $Cedula_Enfermero,
        string $Matricula,
        string $ID_Destino,
        string $CI_Paciente,
        string $Camilla,
        int $Oxigeno
    ): bool {
        $sqlTraslado = 'INSERT INTO Traslado(Fecha, Hora_Salida, Hora_Llegada, Estado, Lugar_Origen, Cedula_Chofer, Cedula_Enfermero, Matricula, ID_Destino) 
                    VALUES (:fecha, :hora_salida, :hora_llegada, :estado, :lugar_origen, :cedula_chofer, :cedula_enfermero, :matricula, :id_destino)';
        $s1 = $this->conexion->prepare($sqlTraslado);
        $s1->bindParam(':fecha', $fecha);
        $s1->bindParam(':hora_salida', $Hora_Salida);
        $s1->bindParam(':hora_llegada', $Hora_Llegada);
        $s1->bindParam(':estado', $Estado);
        $s1->bindParam(':lugar_origen', $Lugar_Origen);
        $s1->bindParam(':cedula_chofer', $Cedula_Chofer);
        $s1->bindParam(':cedula_enfermero', $Cedula_Enfermero);
        $s1->bindParam(':matricula', $Matricula);
        $s1->bindParam(':id_destino', $ID_Destino);

        $ok1 = $s1->execute();
        if (!$ok1)
            return false;

        $idTraslado = $this->conexion->lastInsertId();

        $s2 = $this->conexion->prepare('INSERT INTO Trasladable(Piso_Retiro, Habitacion_Retiro) VALUES (:piso, :habitacion)');
        $piso = 1;
        $habitacion = 1;
        $s2->bindParam(':piso', $piso, PDO::PARAM_INT);
        $s2->bindParam(':habitacion', $habitacion, PDO::PARAM_INT);

        $ok2 = $s2->execute();
        if (!$ok2)
            return false;

        $idTrasladable = $this->conexion->lastInsertId();

        $s3 = $this->conexion->prepare('INSERT INTO Paciente(ID_Trasladable, CI, Nombre, Accesorio, Camilla, Oxigeno, Aislamiento) VALUES (:id_trasladable, :ci, :nombre, :accesorio, :camilla, :oxigeno, :aislamiento)');
        $nombre = 'Paciente';
        $accesorio = 'Ninguno';
        $aislamiento = 0;

        $s3->bindParam(':id_trasladable', $idTrasladable, PDO::PARAM_INT);
        $s3->bindParam(':ci', $CI_Paciente);
        $s3->bindParam(':nombre', $nombre);
        $s3->bindParam(':accesorio', $accesorio);
        $s3->bindParam(':camilla', $Camilla);
        $s3->bindParam(':oxigeno', $Oxigeno, PDO::PARAM_INT);
        $s3->bindParam(':aislamiento', $aislamiento, PDO::PARAM_INT);

        $ok3 = $s3->execute();
        if (!$ok3)
            return false;

        $s4 = $this->conexion->prepare('INSERT INTO Transporta(ID_Traslado, ID_Trasladable) VALUES (:id_traslado, :id_trasladable)');
        $s4->bindParam(':id_traslado', $idTraslado, PDO::PARAM_INT);
        $s4->bindParam(':id_trasladable', $idTrasladable, PDO::PARAM_INT);

        return $s4->execute();
    }

    public function crearElemento(
        string $fecha,
        string $Hora_Salida,
        string $Hora_Llegada,
        string $Estado,
        string $Lugar_Origen,
        string $Cedula_Chofer,
        string $Cedula_Enfermero,
        string $Matricula,
        string $ID_Destino,
        string $Nombre,
        string $Descripcion,
        string $TipoElemento
    ): bool {
        $sqlTraslado = 'INSERT INTO Traslado(Fecha, Hora_Salida, Hora_Llegada, Estado, Lugar_Origen, Cedula_Chofer, Cedula_Enfermero, Matricula, ID_Destino) 
                    VALUES (:fecha, :hora_salida, :hora_llegada, :estado, :lugar_origen, :cedula_chofer, :cedula_enfermero, :matricula, :id_destino)';
        $s1 = $this->conexion->prepare($sqlTraslado);
        $s1->bindParam(':fecha', $fecha);
        $s1->bindParam(':hora_salida', $Hora_Salida);
        $s1->bindParam(':hora_llegada', $Hora_Llegada);
        $s1->bindParam(':estado', $Estado);
        $s1->bindParam(':lugar_origen', $Lugar_Origen);
        $s1->bindParam(':cedula_chofer', $Cedula_Chofer);
        $s1->bindParam(':cedula_enfermero', $Cedula_Enfermero);
        $s1->bindParam(':matricula', $Matricula);
        $s1->bindParam(':id_destino', $ID_Destino);

        $ok1 = $s1->execute();
        if (!$ok1)
            return false;

        $idTraslado = $this->conexion->lastInsertId();

        $s2 = $this->conexion->prepare('INSERT INTO Trasladable(Piso_Retiro, Habitacion_Retiro) VALUES (:piso, :habitacion)');
        $piso = 1;
        $habitacion = 1;
        $s2->bindParam(':piso', $piso, PDO::PARAM_INT);
        $s2->bindParam(':habitacion', $habitacion, PDO::PARAM_INT);

        $ok2 = $s2->execute();
        if (!$ok2)
            return false;

        $idTrasladable = $this->conexion->lastInsertId();

        $s3 = $this->conexion->prepare('INSERT INTO Elemento(ID_Trasladable, Nombre, Descripcion, Tipo_Elemento) VALUES (:id_trasladable, :nombre, :descripcion, :tipo)');
        $s3->bindParam(':id_trasladable', $idTrasladable, PDO::PARAM_INT);
        $s3->bindParam(':nombre', $Nombre);
        $s3->bindParam(':descripcion', $Descripcion);
        $s3->bindParam(':tipo', $TipoElemento);

        $ok3 = $s3->execute();
        if (!$ok3)
            return false;

        $s4 = $this->conexion->prepare('INSERT INTO Transporta(ID_Traslado, ID_Trasladable) VALUES (:id_traslado, :id_trasladable)');
        $s4->bindParam(':id_traslado', $idTraslado, PDO::PARAM_INT);
        $s4->bindParam(':id_trasladable', $idTrasladable, PDO::PARAM_INT);

        return $s4->execute();
    }

    // Obtener todos los usuarios
    public function obtenerTodos(): array
    {
        $sql = 'SELECT Traslado.*, Vehiculo.Tipo_Vehiculo, Paciente.CI AS CI_Paciente, Elemento.Nombre AS Nombre_Elemento
        FROM Traslado 
        INNER JOIN Vehiculo ON Traslado.Matricula = Vehiculo.Matricula
        LEFT JOIN Transporta ON Traslado.ID_Traslado = Transporta.ID_Traslado
        LEFT JOIN Paciente ON Transporta.ID_Trasladable = Paciente.ID_Trasladable
        LEFT JOIN Elemento ON Transporta.ID_Trasladable = Elemento.ID_Trasladable';

        $sentencia = $this->conexion->prepare($sql);
        $sentencia->execute();

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

    public function obtenerDatosParaSelects(): array
    {
        return [
            'choferes' => $this->conexion->query('SELECT Cedula_Chofer, Nombre_Chofer FROM Chofer')->fetchAll(PDO::FETCH_ASSOC),
            'enfermeros' => $this->conexion->query('SELECT Cedula_Enfermero, Nombre_Enfermero FROM Enfermero')->fetchAll(PDO::FETCH_ASSOC),
            'vehiculos' => $this->conexion->query('SELECT Matricula, Tipo_Vehiculo FROM Vehiculo')->fetchAll(PDO::FETCH_ASSOC),
            'destinos' => $this->conexion->query('SELECT ID_Destino, Nombre FROM Destino')->fetchAll(PDO::FETCH_ASSOC),
            'pacientes' => $this->conexion->query('SELECT CI, Nombre FROM Paciente')->fetchAll(PDO::FETCH_ASSOC),
            'tipo_elementos' => $this->conexion->query('SELECT DISTINCT Tipo_Elemento FROM Elemento')->fetchAll(PDO::FETCH_ASSOC) //Distinct permite evitar duplicados en el select de tipo de elemento
        ];
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