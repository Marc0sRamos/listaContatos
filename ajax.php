<?php

include '/var/www/html/cadastros/config/conection.php';
include '/var/www/html/cadastros/config/autoload.php';

// montar nome da classe controlerr => ContatoController ($classeController)
// montar o nome do arquivo app/controller/ContatoController.php
// checar se o arquivo existe e se pode ser lido
// Criar um objeto

$objController = new $classeController;

// checar se o método existe dentro do objeto criado 
// $metodo
// Se método existe, então invoca (chamar)

$objController->$metodo();


if (($_POST['modulo'] === 'contato' && ($_POST['operacao'] === 'deleteContato'))) {
    $idContato = $_POST['idContato'];
    $contato = new ContatoModel($pdo);
    $contato->deleteContato($idContato);
} elseif (($_POST['modulo'] === 'contato' && ($_POST['operacao'] === 'insertContato'))) {
    $contatoSalvar = new ContatoController();
    $contatos = json_decode($_POST['contatos']);
    $contatoSalvar->salvar($contatos);
} elseif (($_POST['modulo'] === 'contato' && ($_POST['operacao'] === 'getcontatoDB'))) {
    $contatoGet = new ContatoController;
    $contatoDB = $_POST['contatoDB'];
    $contatoGet->listarContatosGet($contatoDB);
} elseif (($_POST['modulo'] === 'cidade' && ($_POST['operacao'] === 'getCidade'))) {
    $teste = new CidadeController;
    $teste->getCidade();
} elseif (($_POST['modulo'] === 'usuario' && ($_POST['operacao'] === 'validarLogin'))) {
    $dados = $_POST['dados'];
    $validarUsuario = new Usuario($pdo);
    $validarUsuario->validarLogin($dados);
}


