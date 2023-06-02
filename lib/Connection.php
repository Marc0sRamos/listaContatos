<?php 

Class Connection
{
    private $host;
    private $dbNome;
    private $usuario;
    private $senha;

    function __construct()
    {
        $arrConfig = require 'config.php';
        $this->host = $arrConfig['host'];
        $this->dbNome = $arrConfig['db'];
        $this->usuario = $arrConfig['user'];
        $this->senha = $arrConfig['password'];
    }

    public function connect(): PDO
    {
        try {
            $dsn = "pgsql:host=" . $this->host . "; port=5432;dbname=" . $this->dbNome;

            $pdo = new PDO($dsn, $this->usuario, $this->senha, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

            if (!$pdo) {
                throw new Exception("Erro de conexão.");
            }
            return $pdo;
        } catch (PDOException $e) {
            die($e->getMessage());
        }
    }

}