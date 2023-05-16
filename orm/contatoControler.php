<?php
include './ContatoModel.php';
include './ContatoValidacao.php';


if (isset($_POST['operacao']) && ($_POST['operacao']) === 'deleteContato') {
    $idContato = $_POST['idContato'];
    $contato = new ContatoModel($pdo);
    $contato->deleteContato($idContato);
} 
else if (isset($_POST['operacao']) && ($_POST['operacao']) === 'insertContato') { // salvar
    $contatos = json_decode($_POST['contatos']);
    salvar($contatos);
} 
else if ($_POST['operacao'] === 'getcontatosDB') {
    listarContatosGet($contatoDB);
} 
else {
    echo "Nenhum parâmetro válido foi passado na requisição";
}

function listarContatosGet($contatoDB)
{
    $response = ['erro' => false, 'mensagem' => '', 'dados' => []];

    $contatoDB = $_POST['contatosDB'];
    $getContatos = new ContatoModel();
    $contatosteste = $getContatos->getContatosDB($contatoDB);

    foreach ($contatosteste as $key => $sql) {
        $contatosteste[$key]['telefone'] = explode(',', $sql['telefone']);
    }
    $response['dados'] = $contatosteste;

    $json = json_encode($response);
    echo $json;
}
  
function salvar($contatos)
{

    $contatoValidacao = new ContatoValidacao();

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
    }

    $salvar = new ContatoModel();
    $salvar->salvar($contatos);
}
