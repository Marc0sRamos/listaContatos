<?php

class CidadeModel
{
    private $pdo;

    function __construct()
    {
        $this->pdo = connect();
    }

    public function getCidadeALL()
    {
        $sql = "SELECT * FROM cidade";
        $cidades =  $this->pdo->query($sql);
        $cidadesRetorno = $cidades->FetchAll(PDO::FETCH_ASSOC);
        return $cidadesRetorno;
    }
}
