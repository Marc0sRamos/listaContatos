<?php

function connect(string $host, string $db, string $user, string $password): PDO
{
    try {
        $dsn = "pgsql:host=$host;port=5432;dbname=$db;";
        $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

        if (!$pdo) {
            throw new Exception("Erro de conexão.");
        }

        return $pdo;

    } catch (PDOException $e) {
        die($e->getMessage());
    }
}


$arrConfig = require 'orm/config.php';

return connect(
    $arrConfig['host'], 
    $arrConfig['db'], 
    $arrConfig['user'], 
    $arrConfig['password']
);

