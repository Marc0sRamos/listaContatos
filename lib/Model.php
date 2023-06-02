<?php

class Model 
{
    protected $pdo;

    function __construct()
    {
        $conection = new Connection;
        $pdo = $conection->connect();
    }
}