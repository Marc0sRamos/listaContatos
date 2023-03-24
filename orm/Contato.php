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

            $this->pdo->beginTransaction();

            foreach ($contatos as $contato) {

                $contatoFilter = new ContatoFilter();
                $contato->email = $contatoFilter->filtrarEmail($contato->email);
                $contato->nome = $contatoFilter->filtrarNome($contato->nome);
                $contato->observacao = $contatoFilter->filtrarObs($contato->observacao);

                if ($contatoValidação->validarDados($contato) === false) {
                    $erro = true;
                    continue;
                }

                if ($contato->observacao === '') {
                    $contato->observacao = 'NULL';
                }

                $sql = "INSERT INTO contato (id_contato,email,nome,observacao,sexo, data_ultima_sincronizacao, data_insert,id_usuario_ultima_sincronizacao,id_usuario_insert)       
                VALUES ('$contato->codigoContato', '$contato->email','$contato->nome', 
                '$contato->observacao', '$contato->sexo', 'now()', '$contato->dataInsert', $contato->id_usuario_ultima_sincronizacao, $contato->idUsuarioInsert)";

                $insert = $this->pdo->exec($sql);
                if ($insert !== 1) {
                    throw new Exception('Não foi possivel conectar no banco!');
                }
            }

            if ($erro === true) {
                throw new Exception('Um ou mais contatos não foram validados!');
            }

            $this->pdo->commit();

        } catch (Exception $e) {

            $this->pdo->rollback();

            $arrayErros = $contatoValidação->getErro();

            $jsonErros = json_encode($arrayErros);
            echo $jsonErros;
            // converter array de erro em string json
            // imprimir sting json

            // echo 'Exceção capturada: ' .  $e->getMessage() . "\n";
        }
    }
}

$contatos = $_POST['contatos'];
$contatos = json_decode($contatos);
$contatos[2]->sexo = 'g';

$contato = new Contato($pdo);
$contato->insertContato($contatos);
