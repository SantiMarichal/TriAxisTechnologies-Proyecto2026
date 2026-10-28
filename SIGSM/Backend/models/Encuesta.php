<?php

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/Pregunta.php';
require_once __DIR__ . '/Respuesta.php';

class Encuesta
{
    private PDO $conexion;
    private Pregunta $preguntaModel;
    private Respuesta $respuestaModel;

    public function __construct()
    {
        $this->conexion = Database::getInstancia()->getConexion();
        $this->preguntaModel = new Pregunta();
        $this->respuestaModel = new Respuesta();
    }

    public function obtenerPorCategoria(int $idCategoria): ?array
    {
        $sql = "SELECT e.*, c.Nombre AS Categoria_Nombre 
                FROM Encuesta e
                INNER JOIN Categorias c ON e.ID_Categoria = c.ID_Categoria
                WHERE e.ID_Categoria = :id_categoria 
                LIMIT 1";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bindParam(':id_categoria', $idCategoria, PDO::PARAM_INT);
        $stmt->execute();
        $encuesta = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$encuesta) {
            return null;
        }

        $idEncuesta = $encuesta['ID_Encuesta'];
        $preguntas = $this->preguntaModel->obtenerPorEncuesta($idEncuesta);

        foreach ($preguntas as &$pregunta) {
            $pregunta['respuestas'] = $this->respuestaModel->obtenerPorPregunta($idEncuesta, $pregunta['ID_Pregunta']);
        }

        $encuesta['preguntas'] = $preguntas;

        return $encuesta;
    }

    private function procesarRespuestaIndividual(int $idPregunta, int $idRespuesta): bool
    {
        $sql = "UPDATE Respuestas 
            SET Cantidad_Votos = Cantidad_Votos + 1 
            WHERE ID_Respuesta = :id_respuesta AND ID_Pregunta = :id_pregunta";

        $stmt = $this->conexion->prepare($sql);

        $stmt->bindParam(':id_pregunta', $idPregunta, PDO::PARAM_INT);
        $stmt->bindParam(':id_respuesta', $idRespuesta, PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function guardarRespuestasEncuesta(array $respuestas): bool
    {
        try {
            foreach ($respuestas as $idPregunta => $idRespuesta) {
                $this->procesarRespuestaIndividual((int) $idPregunta, (int) $idRespuesta);
            }
        } catch (PDOException $e) {
            return false;
        }

        return true;
    }
}