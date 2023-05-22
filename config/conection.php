<?php

function connect(): PDO
{
    $arrConfig = require 'config.php';
 
    try {
        $dsn = "pgsql:host=" . $arrConfig['host'] . ";port=5432;dbname=" . $arrConfig['db'];

        $pdo = new PDO($dsn,$arrConfig['user'], $arrConfig['password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

        if (!$pdo) {
            throw new Exception("Erro de conexão.");
        }

        return $pdo;
    } catch (PDOException $e) {
        die($e->getMessage());
    }
}

