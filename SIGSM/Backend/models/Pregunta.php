<?php
require_once __DIR__ . '/../config/Database.php';

class Pregunta
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::getInstancia()->getConexion();
    }

    public function obtenerPorEncuesta(int $idEncuesta): array
    {
        $sql = "SELECT * FROM Preguntas WHERE ID_Encuesta = :id_encuesta";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bindParam(':id_encuesta', $idEncuesta, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}