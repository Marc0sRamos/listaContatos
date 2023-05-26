<?php

class CidadeModel extends Model
{
    public function getCidadeALL()
    {
        $sql = "SELECT * FROM cidade";
        $cidades =  $this->pdo->query($sql);
        $cidadesRetorno = $cidades->FetchAll(PDO::FETCH_ASSOC);
        return $cidadesRetorno;
    }
}
