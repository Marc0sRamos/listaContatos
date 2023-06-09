<?php

class Model 
{
    protected  $pdo;

    function __construct()
    {
        $conection = new Connection;
        $this->pdo = $conection->getConnection();
    }
}