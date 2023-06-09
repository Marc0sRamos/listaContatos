<?php

class TelefoneModel extends Model
{
    public function excluir($codigoContato)
    {

        $sqlDeleteTelefone = "DELETE FROM telefone WHERE id_contato_fk = '{$codigoContato}'";
    
        $this->pdo->exec($sqlDeleteTelefone);
    }

    public function insert($codigoContato, $telefone)
    {
        $sqlInsertTelefone = "INSERT INTO telefone (id_contato_fk, telefone)
        VALUES ('$codigoContato', '$telefone')";
        
        return $this->pdo->exec($sqlInsertTelefone);
    }
}
