<?php
// Configuración para docker-compose
define('SERVERNAME', 'database'); // database es el nombre del servicio en docker-compose
define('USERNAME', 'root'); // Nombre de usuario definido en docker-compose
define('PASSWORD', '1234'); // Contraseña definida en docker-compose
define('DBNAME', 'Proyecto2026'); // Nombre de la base de datos definido en

// Configuración para xampp
/*define('SERVERNAME', 'localhost'); // database es el nombre del servicio en docker-compose
define('USERNAME', 'root'); // Nombre de usuario definido en docker-compose
define('PASSWORD', ''); // Contraseña definida en docker-compose
define('DBNAME', 'Proyecto2026'); // Nombre de la base de datos definido en docker-compose*/


class Database
{
    private static ?Database $instancia = null;
    private PDO $conexion;

    private function __construct()
    {
        $host = SERVERNAME;
        $db = DBNAME;
        $user = USERNAME;
        $pass = PASSWORD;
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

        try {
            $this->conexion = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ]);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage(), $e->getCode());
        }
    }

    public static function getInstancia(): Database
    {
        if (self::$instancia === null) {
            self::$instancia = new Database(); // $this->instancia = new Database(); error
        }
        return self::$instancia;
    }

    public function getConexion(): PDO
    {
        return $this->conexion;
    }
}