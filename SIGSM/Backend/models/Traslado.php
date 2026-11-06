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
        int $Oxigeno,
        int $Aislamiento,
        string $Accesorio,
        int $piso,
        int $habitacion
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

        if (!$s1->execute())
            return false;
        $idTraslado = $this->conexion->lastInsertId();

        $sqlTrasladable = 'INSERT INTO Trasladable(Piso_Retiro, Habitacion_Retiro, CI, Camilla, Oxigeno, Aislamiento, Accesorio) 
                           VALUES (:piso, :habitacion, :ci, :camilla, :oxigeno, :aislamiento, :accesorio)';
        $s2 = $this->conexion->prepare($sqlTrasladable);
        $s2->bindParam(':piso', $piso, PDO::PARAM_INT);
        $s2->bindParam(':habitacion', $habitacion, PDO::PARAM_INT);
        $s2->bindParam(':ci', $CI_Paciente);
        $s2->bindParam(':camilla', $Camilla);
        $s2->bindParam(':oxigeno', $Oxigeno, PDO::PARAM_INT);
        $s2->bindParam(':aislamiento', $Aislamiento, PDO::PARAM_INT);
        $s2->bindParam(':accesorio', $Accesorio);

        if (!$s2->execute())
            return false;
        $idTrasladable = $this->conexion->lastInsertId();

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
        string $TipoElemento,
        int $piso,
        int $habitacion
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

    public function crearPacienteBase(string $ci, string $nombre): bool
    {
        $sql = 'INSERT INTO Paciente (CI, Nombre) VALUES (:ci, :nombre)';
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(':ci', $ci);
        $sentencia->bindParam(':nombre', $nombre);

        return $sentencia->execute();
    }

    public function crearChofer($cedula, $nombre, $apellido, $telefono): bool
    {
        $sql = "INSERT INTO Chofer (Cedula_Chofer, Nombre_Chofer, Apellido_Chofer, Telefono) VALUES (:cedula, :nombre, :apellido, :telefono)";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bindParam(':cedula', $cedula);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':apellido', $apellido);
        $stmt->bindParam(':telefono', $telefono);
        return $stmt->execute();
    }

    public function crearVehiculo($matricula, $modelo, $capacidad, $tipo): bool
    {
        $sql = "INSERT INTO Vehiculo (Matricula, Modelo, Capacidad, Tipo_Vehiculo) VALUES (:matricula, :modelo, :capacidad, :tipo)";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bindParam(':matricula', $matricula);
        $stmt->bindParam(':modelo', $modelo);
        $stmt->bindParam(':capacidad', $capacidad);
        $stmt->bindParam(':tipo', $tipo);
        return $stmt->execute();
    }

    public function crearDestino($nombre, $direccion, $ruta): bool
    {
        $sql = "INSERT INTO Destino (Nombre, Direccion, Ruta) VALUES (:nombre, :direccion, :ruta)";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':direccion', $direccion);
        $stmt->bindParam(':ruta', $ruta);
        return $stmt->execute();
    }

    // Obtener todos los usuarios
    public function obtenerTodos(): array
    {
        $sql = 'SELECT Traslado.*, Vehiculo.Tipo_Vehiculo, 
                       Trasladable.CI AS CI_Paciente, 
                       Paciente.Nombre AS Nombre_Paciente,
                       Elemento.Nombre AS Nombre_Elemento, 
                       Trasladable.Accesorio AS Accesorio, 
                       Trasladable.Oxigeno AS Oxigeno, 
                       Trasladable.Aislamiento AS Aislamiento, 
                       Trasladable.Camilla AS Camilla, 
                       Destino.Nombre AS Nombre_Destino, 
                       Trasladable.Piso_Retiro AS Piso_Retiro, 
                       Trasladable.Habitacion_Retiro AS Habitacion_Retiro
                FROM Traslado 
                INNER JOIN Vehiculo ON Traslado.Matricula = Vehiculo.Matricula
                LEFT JOIN Transporta ON Traslado.ID_Traslado = Transporta.ID_Traslado
                LEFT JOIN Trasladable ON Transporta.ID_Trasladable = Trasladable.ID_Trasladable
                LEFT JOIN Paciente ON Trasladable.CI = Paciente.CI
                LEFT JOIN Elemento ON Transporta.ID_Trasladable = Elemento.ID_Trasladable
                LEFT JOIN Destino ON Traslado.ID_Destino = Destino.ID_Destino';

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
            'pacientes' => $this->conexion->query('SELECT CI, Nombre FROM Paciente GROUP BY CI, Nombre')->fetchAll(PDO::FETCH_ASSOC),
            'accesorios' => $this->conexion->query('SELECT DISTINCT Accesorio FROM Trasladable')->fetchAll(PDO::FETCH_ASSOC),
            'camillas' => $this->conexion->query('SELECT DISTINCT Camilla FROM Trasladable')->fetchAll(PDO::FETCH_ASSOC),
            'tipo_elementos' => $this->conexion->query('SELECT DISTINCT Tipo_Elemento FROM Elemento')->fetchAll(PDO::FETCH_ASSOC) //Distinct permite evitar duplicados en el select de tipo de elemento
        ];
    }

    public function obtenerPacientes()
    {
        $stmt = $this->conexion->query("SELECT * FROM Paciente");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function obtenerChoferes()
    {
        $stmt = $this->conexion->query("SELECT * FROM Chofer");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerVehiculos()
    {
        $stmt = $this->conexion->query("SELECT * FROM Vehiculo");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerDestinos()
    {
        $stmt = $this->conexion->query("SELECT * FROM Destino");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Modificar usuario
    public function actualizarElemento(string $id, string $fecha, string $Hora_Salida, string $Hora_Llegada, string $Estado, string $Lugar_Origen, string $Cedula_Chofer, string $Cedula_Enfermero, string $Matricula, string $ID_Destino, string $Nombre_Elemento, string $Descripcion, string $Tipo_Elemento, int $Piso_Retiro, int $Habitacion_Retiro): bool
    {
        $sqlTraslado = 'UPDATE Traslado 
                        SET Fecha = :fecha, 
                            Hora_Salida = :hora_salida, 
                            Hora_Llegada = :hora_llegada, 
                            Estado = :estado, 
                            Lugar_Origen = :lugar_origen, 
                            Cedula_Chofer = :cedula_chofer, 
                            Cedula_Enfermero = :cedula_enfermero, 
                            Matricula = :matricula, 
                            ID_Destino = :id_destino 
                        WHERE ID_Traslado = :id';

        $sentenciaTraslado = $this->conexion->prepare($sqlTraslado);
        $sentenciaTraslado->bindParam(":fecha", $fecha);
        $sentenciaTraslado->bindParam(":hora_salida", $Hora_Salida);
        $sentenciaTraslado->bindParam(":hora_llegada", $Hora_Llegada);
        $sentenciaTraslado->bindParam(":estado", $Estado);
        $sentenciaTraslado->bindParam(":lugar_origen", $Lugar_Origen);
        $sentenciaTraslado->bindParam(":cedula_chofer", $Cedula_Chofer);
        $sentenciaTraslado->bindParam(":cedula_enfermero", $Cedula_Enfermero);
        $sentenciaTraslado->bindParam(":matricula", $Matricula);
        $sentenciaTraslado->bindParam(":id_destino", $ID_Destino);
        $sentenciaTraslado->bindParam(":id", $id);

        if (!$sentenciaTraslado->execute()) {
            return false;
        }

        $sqlTrasladable = 'SELECT Transporta.ID_Trasladable FROM Transporta WHERE Transporta.ID_Traslado = :id';
        $sentenciaTrasladable = $this->conexion->prepare($sqlTrasladable);
        $sentenciaTrasladable->bindParam(":id", $id);
        $sentenciaTrasladable->execute();
        $trasladable = $sentenciaTrasladable->fetch(PDO::FETCH_ASSOC);

        if (!$trasladable) {
            return false;
        }

        $idTrasladable = $trasladable['ID_Trasladable'];

        $sqlPisoHabitacion = 'UPDATE Trasladable 
                        SET Piso_Retiro = :piso_retiro, 
                            Habitacion_Retiro = :habitacion_retiro 
                        WHERE ID_Trasladable = :id_trasladable';
        $sqlPisoHabitacion = $this->conexion->prepare($sqlPisoHabitacion);
        $sqlPisoHabitacion->bindParam(":piso_retiro", $Piso_Retiro, PDO::PARAM_INT);
        $sqlPisoHabitacion->bindParam(":habitacion_retiro", $Habitacion_Retiro, PDO::PARAM_INT);
        $sqlPisoHabitacion->bindParam(":id_trasladable", $idTrasladable, PDO::PARAM_INT);
        $sqlPisoHabitacion->execute();

        $sqlElemento = 'UPDATE Elemento 
                        SET Nombre = :nombre, 
                            Descripcion = :descripcion, 
                            Tipo_Elemento = :tipo_elemento 
                        WHERE ID_Trasladable = :id_trasladable';

        $sentenciaElemento = $this->conexion->prepare($sqlElemento);
        $sentenciaElemento->bindParam(":nombre", $Nombre_Elemento);
        $sentenciaElemento->bindParam(":descripcion", $Descripcion);
        $sentenciaElemento->bindParam(":tipo_elemento", $Tipo_Elemento);
        $sentenciaElemento->bindParam(":id_trasladable", $idTrasladable, PDO::PARAM_INT);

        return $sentenciaElemento->execute();
    }

    public function actualizarPaciente(string $id, string $fecha, string $Hora_Salida, string $Hora_Llegada, string $Estado, string $Lugar_Origen, string $Cedula_Chofer, string $Cedula_Enfermero, string $Matricula, string $ID_Destino, string $CI_Paciente, string $Camilla, int $Oxigeno, int $Aislamiento, string $Accesorio, int $Piso_Retiro, int $Habitacion_Retiro): bool
    {
        $sqlTraslado = 'UPDATE Traslado 
                        SET Fecha = :fecha, 
                            Hora_Salida = :hora_salida, 
                            Hora_Llegada = :hora_llegada, 
                            Estado = :estado, 
                            Lugar_Origen = :lugar_origen, 
                            Cedula_Chofer = :cedula_chofer, 
                            Cedula_Enfermero = :cedula_enfermero, 
                            Matricula = :matricula, 
                            ID_Destino = :id_destino 
                        WHERE ID_Traslado = :id';

        $sentenciaTraslado = $this->conexion->prepare($sqlTraslado);
        $sentenciaTraslado->bindParam(":fecha", $fecha);
        $sentenciaTraslado->bindParam(":hora_salida", $Hora_Salida);
        $sentenciaTraslado->bindParam(":hora_llegada", $Hora_Llegada);
        $sentenciaTraslado->bindParam(":estado", $Estado);
        $sentenciaTraslado->bindParam(":lugar_origen", $Lugar_Origen);
        $sentenciaTraslado->bindParam(":cedula_chofer", $Cedula_Chofer);
        $sentenciaTraslado->bindParam(":cedula_enfermero", $Cedula_Enfermero);
        $sentenciaTraslado->bindParam(":matricula", $Matricula);
        $sentenciaTraslado->bindParam(":id_destino", $ID_Destino);
        $sentenciaTraslado->bindParam(":id", $id);

        if (!$sentenciaTraslado->execute()) {
            return false;
        }

        $sqlTrasladable = 'SELECT Transporta.ID_Trasladable FROM Transporta WHERE Transporta.ID_Traslado = :id';
        $sentenciaTrasladable = $this->conexion->prepare($sqlTrasladable);
        $sentenciaTrasladable->bindParam(":id", $id);
        $sentenciaTrasladable->execute();
        $trasladable = $sentenciaTrasladable->fetch(PDO::FETCH_ASSOC);

        if (!$trasladable) {
            return false;
        }

        $idTrasladable = $trasladable['ID_Trasladable'];
        $sqlActualizar = 'UPDATE Trasladable 
                          SET Piso_Retiro = :piso_retiro, 
                              Habitacion_Retiro = :habitacion_retiro, 
                              CI = :ci, 
                              Camilla = :camilla, 
                              Oxigeno = :oxigeno, 
                              Aislamiento = :aislamiento, 
                              Accesorio = :accesorio 
                          WHERE ID_Trasladable = :id_trasladable';

        $sentenciaActualizar = $this->conexion->prepare($sqlActualizar);
        $sentenciaActualizar->bindParam(":piso_retiro", $Piso_Retiro, PDO::PARAM_INT);
        $sentenciaActualizar->bindParam(":habitacion_retiro", $Habitacion_Retiro, PDO::PARAM_INT);
        $sentenciaActualizar->bindParam(":ci", $CI_Paciente);
        $sentenciaActualizar->bindParam(":camilla", $Camilla);
        $sentenciaActualizar->bindParam(":oxigeno", $Oxigeno, PDO::PARAM_INT);
        $sentenciaActualizar->bindParam(":aislamiento", $Aislamiento, PDO::PARAM_INT);
        $sentenciaActualizar->bindParam(":accesorio", $Accesorio);
        $sentenciaActualizar->bindParam(":id_trasladable", $idTrasladable, PDO::PARAM_INT);

        return $sentenciaActualizar->execute();
    }

    // Eliminar usuario
    public function eliminarTraslado(string $id): bool
    {
        $sql = "DELETE FROM Traslado WHERE ID_Traslado = :id";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":id", $id);

        if ($sentencia->execute()) {
            return $sentencia->rowCount() > 0;
        }
        return false;
    }

    public function eliminarChofer(string $id): bool
    {
        $sql = "DELETE FROM Chofer WHERE Cedula_Chofer = :id";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":id", $id);

        if ($sentencia->execute()) {
            return $sentencia->rowCount() > 0;
        }
        return false;
    }

    public function eliminarVehiculo(string $id): bool
    {
        $sql = "DELETE FROM Vehiculo WHERE Matricula = :id";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":id", $id);

        if ($sentencia->execute()) {
            return $sentencia->rowCount() > 0;
        }
        return false;
    }

    public function eliminarDestino(string $id): bool
    {
        $sql2 = "DELETE FROM Destino WHERE ID_Destino = :id";
        $sentencia2 = $this->conexion->prepare($sql2);
        $sentencia2->bindParam(":id", $id);

        if ($sentencia2->execute()) {
            return $sentencia2->rowCount() > 0;
        }
        return false;
    }

    public function eliminarPaciente(string $id): bool
    {
        $sql = "DELETE FROM Paciente WHERE CI_Paciente = :id";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bindParam(":id", $id);

        if ($sentencia->execute()) {
            return $sentencia->rowCount() > 0;
        }
        return false;
    }
}