<?php
include './ContatoValidacao.php';
include './ContatoFilter.php';


// Verificar o tipo de operação passada na requisição
if (isset($_POST['operacao']) && ($_POST['operacao']) === 'deleteContato') {
    $idContato = $_POST['idContato'];
    $contato = new Contato($pdo);
    $contato->deleteContato($idContato);
} else if (isset($_POST['operacao']) && ($_POST['operacao']) === 'insertContato') {
    $contatos = json_decode($_POST['contatos']);
    $contato = new Contato($pdo);
    $contato->insertContato($contatos);
} else {
    echo "Nenhum parâmetro válido foi passado na requisição";
}


class Contato
{
    private $pdo;

    function __construct($pdo)
    {
        $this->pdo = include './conection.php';
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


    public function insertContato(array $contatos)
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
                    $sqlUptade = "UPDATE contato 
                                  SET id_contato = '$contato->codigoContato', email = '$contato->email', nome = '$contato->nome' , observacao = '$contato->observacao', sexo = '$contato->sexo', data_ultima_sincronizacao = 'now()', data_insert = '$contato->dataInsert', id_usuario_ultima_sincronizacao = $contato->id_usuario_ultima_sincronizacao, id_usuario_insert = $contato->idUsuarioInsert
                                  WHERE id_contato = '{$contato->codigoContato}'";

                    $update = $this->pdo->exec($sqlUptade);
                } else {
                    $sql = "INSERT INTO contato (id_contato,email,nome,observacao,sexo,                     data_ultima_sincronizacao,data_insert,id_usuario_ultima_sincronizacao,id_usuario_insert)       
                                VALUES ('$contato->codigoContato', '$contato->email', '$contato->nome', 
                                '$contato->observacao', '$contato->sexo', 'now()', '$contato->dataInsert', '$contato->id_usuario_ultima_sincronizacao', '$contato->idUsuarioInsert')";


                    $insert = $this->pdo->exec($sql);
                    if ($insert !== 1) {
                        throw new Exception('Não foi possivel conectar no banco!');
                    }
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
