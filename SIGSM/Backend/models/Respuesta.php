<?php
require_once __DIR__ . '/../config/Database.php';

class Respuesta
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::getInstancia()->getConexion();
    }

    public function obtenerPorPregunta(int $idEncuesta, int $idPregunta): array
    {
        $sql = "SELECT * FROM Respuestas WHERE ID_Pregunta = :id_pregunta AND ID_Encuesta = :id_encuesta";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bindParam(':id_pregunta', $idPregunta, PDO::PARAM_INT);
        $stmt->bindParam(':id_encuesta', $idEncuesta, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}