<?php

class Connection
{
    private $credenciais;
    private static $pdo;
    private const ARQUIVO_CREDENCIAIS = '../cadastros/config/config.php';

    public function getConnection()
    {
        try {
            $this->verificarExistenciaDoArquivo();
            $this->lerCredenciais();
            $this->validarCredenciais();

            if ($this->verificarConexaoAberta() === false) {
                $this->conectar();
            }

            return self::$pdo;
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    private function verificarExistenciaDoArquivo()
    {
        if (file_exists(self::ARQUIVO_CREDENCIAIS) === false) {
            throw new Exception('Arquivo de credenciais não encontrado.');
        }
    }

    private function lerCredenciais()
    {
        $this->credenciais = require self::ARQUIVO_CREDENCIAIS;
    }

    private function validarCredenciais()
    {
        if (gettype($this->credenciais) !== 'array') {
            throw new Exception('O conteúdo do arquivo de credenciais é vazio ou invalido.');
        }

        if (isset($this->credenciais['host']) === false) {
            throw new Exception('Credenciais invalidas: o indice "host" não foi encontrado');
        }

        if (isset($this->credenciais['nameDB']) === false) {
            throw new Exception('Credenciais invalidas: o indice "nameDB" não foi encontrado');
        }

        if (isset($this->credenciais['user']) === false) {
            throw new Exception('Credenciais invalidas: o indice "user" não foi encontrado');
        }

        if (isset($this->credenciais['password']) ===  false) {
            throw new Exception('Credenciais invalidas: o indice "password" não foi encontrado.');
        }
    }

    private function verificarConexaoAberta()
    {
        if (gettype(self::$pdo) === 'object' && get_class(self::$pdo) === 'PDO') {
            return true;
        }

        return false;
    }

    private function conectar()
    {
        $dsn = "pgsql:host=" . $this->credenciais['host'] . "; port=5432;dbname=" . $this->credenciais['nameDB'];
        self::$pdo = new PDO($dsn, $this->credenciais['user'], $this->credenciais['password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    }
}
