<?php

class Model 
{
    protected $pdo;

    function __construct()
    {
        $this->pdo = connect();
    }
}