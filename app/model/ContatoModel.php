<?php

// spl_autoload_register(function ($class) {
//     include '/cadastros/app/model' . $class . '.class.php';
// });

class ContatoModel
{
    private $pdo;

    function __construct()
    {
        $this->pdo = connect();
    }

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
        $response = ['erro' => false, 'mensagem' => '', 'dados' => []];

        try {
            $this->pdo->beginTransaction();

            foreach ($codigoContato as $idContato) {
                $sqlSelectID = "SELECT id_contato FROM contato WHERE id_contato = '{$idContato}'";
                $selectID = $this->pdo->query($sqlSelectID);

                $sqlDelete = "DELETE FROM contato WHERE id_contato = '{$idContato}'";
                $delete = $this->pdo->exec($sqlDelete);
            }

            $this->pdo->commit();
            $response['mensagem'] = 'Registro excluído com sucesso';
        } catch (Exception $e) {
            $this->pdo->rollback();
            $response['erro'] = true;
            $response['mensagem'] = 'Erro ao excluir registro';
        }

        $json = json_encode($response);
        echo $json;
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
        $sqlUpdate = "UPDATE contato 
                        SET id_contato = '$contato->codigoContato', email = '$contato->email', nome =       '$contato->nome', municipio= '$contato->municipio', observacao = $contato->observacao, sexo = '$contato->sexo', data_ultima_sincronizacao = 'now()', data_insert = '$contato->dataInsert', id_usuario_ultima_sincronizacao = $contato->id_usuario_ultima_sincronizacao
                        WHERE id_contato = '{$contato->codigoContato}'";
        $update = $this->pdo->exec($sqlUpdate);

        return $update;
    }

    public function inserir(stdClass $contato)
    {
        $sql = "INSERT INTO contato (id_contato,email,nome,municipio,observacao,sexo,                       data_ultima_sincronizacao,data_insert,id_usuario_ultima_sincronizacao,id_usuario_insert)       
                    VALUES ('$contato->codigoContato', '$contato->email', '$contato->nome', '$contato->municipio','$contato->observacao', '$contato->sexo', 'now()', '$contato->dataInsert', '$contato->id_usuario_ultima_sincronizacao', '$contato->idUsuarioInsert')";

        $insert = $this->pdo->exec($sql);

        return $insert;
    }

    public function salvar(array $contatos)
    {
        $contatoValidacao = new ContatoValidacao();
        $response = ['erro' => false, 'mensagem' => '', 'dados' => []];

        try {
            $this->pdo->beginTransaction();

            foreach ($contatos as $contato) {

                $selectID = $this->get($contato->codigoContato);

                if ($selectID->rowCount() > 0) {
                    if ($this->atualizar($contato) === false) {
                        throw new Exception('Não foi possivel realizar a atualização do contato');
                    }
                } elseif ($this->inserir($contato) === false) {
                    throw new Exception('Não foi possivel inserir o contato na base de dados');
                }

                $telefoneModel = new TelefoneModel;
                $telefoneModel->excluir($contato);


                foreach ($contato->telefone as $key => $telefone) {
                    if ($telefoneModel->insert($contato, $telefone) === false) {
                        throw new Exception('Não foi possivel inserir o telefone na base de dados');
                    }
                }
            }

            $this->pdo->commit();
            $response['mensagem'] = 'Sucesso!';
        } catch (Exception $e) {
            $this->pdo->rollback();
            $response['erro'] = true;
            $response['dados'] = $contatoValidacao->getErro();
        }

        $json = json_encode($response);
        echo $json;
    }

    public function insertContato_old(array $contatos)
    {
        $contatoValidacao = new ContatoValidacao();
        $erro = false;
        $response = ['erro' => false, 'mensagem' => '', 'dados' => []];

        try {
            $this->pdo->beginTransaction();

            foreach ($contatos as $contato) {
                $contatoFilter = new ContatoFilter();
                $contato->email = $contatoFilter->filtrarEmail($contato->email);
                $contato->nome = $contatoFilter->filtrarNome($contato->nome);
                $contato->observacao = $contatoFilter->filtrarObs($contato->observacao);

                if ($contatoValidacao->validarDados($contato) === false) {
                    $erro = true;
                    continue;
                }

                if ($contato->observacao === '') {
                    $contato->observacao = 'NULL';
                }

                $sqlSelectID = "SELECT id_contato FROM contato WHERE id_contato = '{$contato->codigoContato}'";
                $selectID = $this->pdo->query($sqlSelectID);

                if ($selectID->rowCount() > 0) {
                    $sqlUpdate = "UPDATE contato 
                                  SET id_contato = '$contato->codigoContato', email = '$contato->email', nome = '$contato->nome', municipio= '$contato->municipio', observacao = $contato->observacao, sexo = '$contato->sexo', data_ultima_sincronizacao = 'now()', data_insert = '$contato->dataInsert', id_usuario_ultima_sincronizacao = $contato->id_usuario_ultima_sincronizacao
                                  WHERE id_contato = '{$contato->codigoContato}'";


                    $update = $this->pdo->exec($sqlUpdate);
                } else {
                    $sql = "INSERT INTO contato (id_contato,email,nome,municipio,observacao,sexo,           data_ultima_sincronizacao,data_insert,id_usuario_ultima_sincronizacao,id_usuario_insert)       
                                VALUES ('$contato->codigoContato', '$contato->email', '$contato->nome', '$contato->municipio',
                                '$contato->observacao', '$contato->sexo', 'now()', '$contato->dataInsert', '$contato->id_usuario_ultima_sincronizacao', '$contato->idUsuarioInsert')";

                    $insert = $this->pdo->exec($sql);
                    if ($insert !== 1) {
                        throw new Exception('Não foi possivel conectar no banco');
                    }
                }

                $sqlDeleteTelefone = "DELETE FROM telefone WHERE id_contato_fk = '{$contato->codigoContato}'";
                $this->pdo->exec($sqlDeleteTelefone);

                foreach ($contato->telefone as $key => $telefone) {

                    $sqlInsertTelefone = "INSERT INTO telefone (id_contato_fk, telefone)
                                        VALUES ('$contato->codigoContato', '$telefone')";

                    $insertTelefone = $this->pdo->exec($sqlInsertTelefone);
                }
            }

            if ($erro === true) {
                throw new Exception('Um ou mais contatos não foram validados!');
            }

            $this->pdo->commit();
            $response['mensagem'] = 'Sucesso!';
        } catch (Exception $e) {
            $this->pdo->rollback();

            $response['erro'] = true;
            $response['dados'] = $contatoValidacao->getErro();
        }

        $json = json_encode($response);
        echo $json;
    }
}
