<?php

class ContatoModel extends Model
{
    public function getContatosDB()
    {
        $sqlSelectGet = "SELECT c.*, string_agg(t.telefone, ',') as telefone 
                     FROM contato c
                     JOIN telefone t ON c.id_contato = t.id_contato_fk
                     GROUP BY c.id_contato";

        $sqlSelect = $this->pdo->query($sqlSelectGet);
        $resultSelect = $sqlSelect->FetchAll(PDO::FETCH_ASSOC);

        return $resultSelect;
    }

    public function deleteContato($codigoContato)
    {
        $response = new Response;
        try {
            $this->pdo->beginTransaction();

            foreach ($codigoContato as $idContato) {
                $sql = "DELETE FROM contato WHERE id_contato = '{$idContato}'";
                $this->pdo->exec($sql);
                $telefoneModel = new TelefoneModel;
                $telefoneModel->excluir($idContato);
            }

            $this->pdo->commit();
            $response->setMensagem('Registro excluído com sucesso');
        } catch (Exception $e) {
            $this->pdo->rollback();
            $response->setErro();
            $response->setMensagem('Erro ao excluir registro');
        }

        $response->print();
    }

    public function get($idContato)
    {
        $sqlSelectID = "SELECT id_contato FROM contato WHERE id_contato = '{$idContato}'";
        $selectID = $this->pdo->query($sqlSelectID);
        $resultSelectID = $selectID->Fetch(PDO::FETCH_ASSOC);
        return $selectID;
    }

    public function atualizar(stdClass $contato)
    {
        if ($contato->observacao === '') {
            $contato->observacao = 'NULL';
        }

        $sqlUpdate = "UPDATE contato 
                        SET id_contato = '$contato->codigoContato', email = '$contato->email', nome ='$contato->nome', municipio= '$contato->municipio', observacao = $contato->observacao, sexo = '$contato->sexo', data_ultima_sincronizacao = 'now()', data_insert = '$contato->dataInsert', id_usuario_ultima_sincronizacao = $contato->id_usuario_ultima_sincronizacao
                        WHERE id_contato = '{$contato->codigoContato}'";

        return  $this->pdo->exec($sqlUpdate);
    }

    public function inserir(stdClass $contato)
    {

        if ($contato->observacao === '') {
            $contato->observacao = 'NULL';
        }

        $sql = "INSERT INTO contato (id_contato,email,nome,municipio,observacao,sexo,data_ultima_sincronizacao,data_insert,id_usuario_ultima_sincronizacao,id_usuario_insert)       
                    VALUES ('$contato->codigoContato', '$contato->email', '$contato->nome', '$contato->municipio','$contato->observacao', '$contato->sexo', 'now()', '$contato->dataInsert', '$contato->id_usuario_ultima_sincronizacao', '$contato->idUsuarioInsert')";

        return $this->pdo->exec($sql);
    }

    public function salvar(array $contatos)
    {
        $contatoValidacao = new ContatoValidacao();
        $response = new Response;

        try {
            $this->pdo->beginTransaction();

            foreach ($contatos as $contato) {

                $selectID = $this->get($contato->codigoContato);

                if ($selectID->rowCount() <= 0) {
                    if (false === $result = $this->inserir($contato)) {
                        throw new Exception('Não foi possivel inserir o contato na base de dados');
                    }
                } else {
                    if ($this->atualizar($contato) === false) {
                        throw new Exception('Não foi possivel realizar a atualização do contato');
                    }
                }


                $telefoneModel = new TelefoneModel;
                $telefoneModel->excluir($contato->codigoContato);

                foreach ($contato->telefone as $key => $telefone) {
                    if ($telefoneModel->insert($contato->codigoContato, $telefone) === false) {
                        throw new Exception("Não foi possivel inserir o telefone na base de dados");
                    }
                }
            }

            $this->pdo->commit();
            $response->setMensagem('Sucesso');
        } catch (Exception $e) {
            $this->pdo->rollback();
            $response->setErro();
            $response->setMensagem($e);
            $response->setDados($contatoValidacao->getErro());
        }

        $response->print();
    }
}
