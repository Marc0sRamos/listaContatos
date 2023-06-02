<?php

class Connection
{
    private $host;
    private $dbNome;
    private $usuario;
    private $senha;
    private static $pdo;

    function __construct()
    {
        $arrConfig = require '../cadastros/config/config.php';
        $this->host = $arrConfig['host'];
        $this->dbNome = $arrConfig['db'];
        $this->usuario = $arrConfig['user'];
        $this->senha = $arrConfig['password'];
    }

    // fn getConnection
    // fn lerCredenciaisDeAcesso
    // fn verficarConexaoAberta
    // fn conectar

    



    public function connect(): PDO
    {
        if (gettype(self::$pdo) === 'object' && get_class(self::$pdo) === 'PDO') {
            return self::$pdo;
        }

        try {
            $dsn = "pgsql:host=" . $this->host . "; port=5432;dbname=" . $this->dbNome;
            self::$pdo = new PDO($dsn, $this->usuario, $this->senha, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

            if (!self::$pdo) {
                throw new Exception("Erro de conexão.");
            }

            return self::$pdo;
        } catch (PDOException $e) {
            echo 'Erro na conexão';
            die($e->getMessage());
        }
    }
}