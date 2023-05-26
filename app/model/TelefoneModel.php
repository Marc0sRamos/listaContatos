<?php

class TelefoneModel extends Model
{
    public function excluir($contato)
    {
        $sqlDeleteTelefone = "DELETE FROM telefone WHERE id_contato_fk = '{$contato->codigoContato}'";
        $this->pdo->exec($sqlDeleteTelefone);
    }

    public function insert($contato, $telefone)
    {
        $sqlInsertTelefone = "INSERT INTO telefone (id_contato_fk, telefone)
        VALUES ('$contato->codigoContato', '$telefone')";

        $insertTelefone = $this->pdo->exec($sqlInsertTelefone);
    }
}
