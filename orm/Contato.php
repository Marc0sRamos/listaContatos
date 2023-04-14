<?php
include './ContatoValidacao.php';
include './ContatoFilter.php';

class Contato
{
    private $pdo;

    function __construct($pdo)
    {
        $this->pdo = include './conection.php';
    }


    public function insertContato(array $contatos)
    {
        $contatoValidação = new ContatoValidacao();
        $erro = false;

        try {

            foreach ($contatos as $contato) {
                $this->pdo->beginTransaction();

                $contatoFilter = new ContatoFilter();
                $contato->email = $contatoFilter->filtrarEmail($contato->email);
                $contato->nome = $contatoFilter->filtrarNome($contato->nome);
                $contato->observacao = $contatoFilter->filtrarObs($contato->observacao);

                if ($contatoValidação->validarDados($contato) === false) {
                    $erro = true;
                    continue;
                }

                if ($erro === true) {
                    throw new Exception('Um ou mais contatos não foram validados!');
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

                    $sql = "INSERT INTO contato (id_contato,email,nome,observacao,sexo,data_ultima_sincronizacao,data_insert,id_usuario_ultima_sincronizacao,id_usuario_insert)       
                                VALUES ('$contato->codigoContato', '$contato->email', '$contato->nome', 
                                '$contato->observacao', '$contato->sexo', 'now()', '$contato->dataInsert', '$contato->id_usuario_ultima_sincronizacao', '$contato->idUsuarioInsert')";
      

                    $insert = $this->pdo->exec($sql);
                    if ($insert !== 1) {
                        throw new Exception('Não foi possivel conectar no banco!');
                    }
                }

                $this->pdo->commit();                
            }
        } catch (Exception $e) {
            
            $this->pdo->rollback();

            $arrayErros[] = $contatoValidação->getErro();

            $jsonErros = json_encode($arrayErros);
            echo $jsonErros;

        }
    }
}

$contatos = $_POST['contatos'];
$contatos = json_decode($contatos);
$contatos[1]->sexo = 'g';
// $contatos[0]->sexo = 'r';

$contato = new Contato($pdo);
$contato->insertContato($contatos);
