<?php
require_once __DIR__ . '/../config/Database.php';

class Encuesta
{
    private PDO $conexion;

    public function __construct() { 
        $this->conexion = Database::getInstancia()->getConexion(); 
    }
    
    public function obtenerEncuestaGenerica(): ?array 
    {
        $sql = "SELECT * FROM Encuesta LIMIT 1";
        $stmt = $this->conexion->prepare($sql);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        return $resultado ? $resultado : null;
    }

    public function guardarRespuesta(string $satisfaccion, array $aspectos): bool
    {
        $encuesta = $this->obtenerEncuestaGenerica();
        if (!$encuesta) {
            return false;
        }
        $idEncuesta = $encuesta['ID_Encuesta'];

        $sql = "INSERT INTO Usuario_Respuesta (ID_Encuesta, ID_Pregunta, ID_Respuesta) 
                VALUES (:id_encuesta, :id_pregunta, :id_respuesta)";

        $stmt = $this->conexion->prepare($sql);
        
        $idPregunta1 = 'P001'; 

        $stmt->bindParam(':id_encuesta', $idEncuesta);
        $stmt->bindParam(':id_pregunta', $idPregunta1);
        $stmt->bindParam(':id_respuesta', $satisfaccion);

        if (!$stmt->execute()) {
            return false;
        }

        $idPregunta2 = 'P002';
        foreach ($aspectos as $aspectoId) {
            $stmtAspecto = $this->conexion->prepare($sql);

            $stmtAspecto->bindParam(':id_encuesta', $idEncuesta);
            $stmtAspecto->bindParam(':id_pregunta', $idPregunta2);
            $stmtAspecto->bindParam(':id_respuesta', $aspectoId);

            if (!$stmtAspecto->execute()) {
                return false;
            }
        }

        return true;
    }
}