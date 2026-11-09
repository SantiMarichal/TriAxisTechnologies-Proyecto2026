<?php
require_once __DIR__ . '/../config/Database.php';

class Categoria
{
    private PDO $conexion;

    public function __construct()
    {
        $this->conexion = Database::getInstancia()->getConexion();
    }

    public function crear(string $nombre): bool
    {
        $sql = "INSERT INTO Categorias (Nombre) VALUES (:nombre)";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function obtenerTodas(): array
    {
        $sql = "SELECT * FROM Categorias";
        $stmt = $this->conexion->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorId(int $id): ?array
    {
        $sql = "SELECT * FROM Categorias WHERE ID_Categoria = :id";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        return $resultado ? $resultado : null;
    }

    public function eliminar(int $id): bool
    {
        $stmtCheck = $this->conexion->prepare("SELECT COUNT(*) FROM Documentos WHERE ID_Categoria = :id");
        $stmtCheck->execute([':id' => $id]);
        $tieneDocumentos = $stmtCheck->fetchColumn();

        if ($tieneDocumentos > 0) {
            http_response_code(400);
            echo json_encode(['mensaje' => 'No se puede eliminar la categoría porque tiene documentos asociados.']);
            exit;
        }
        $sql = "DELETE FROM Categorias WHERE ID_Categoria = :id";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        if ($stmt->execute()) {
            return $stmt->rowCount() > 0;
        }
        return false;
    }
}