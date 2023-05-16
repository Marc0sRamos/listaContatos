<?php

class TelefoneModel
{
    private $pdo;

    function __construct()
    {
        $this->pdo = include './conection.php';
    }

    // método somente para excluir na classe TelefoneModel
    public function excluir($contato)
    {
        $sqlDeleteTelefone = "DELETE FROM telefone WHERE id_contato_fk = '{$contato->codigoContato}'";
        $this->pdo->exec($sqlDeleteTelefone);
    }

    // método somente para inserir telefone na classe TelefoneModel
    public function insert($contato, $telefone)
    {
        $sqlInsertTelefone = "INSERT INTO telefone (id_contato_fk, telefone)
        VALUES ('$contato->codigoContato', '$telefone')";

        $insertTelefone = $this->pdo->exec($sqlInsertTelefone);
    }
}
