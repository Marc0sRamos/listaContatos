<?php

include '/var/www/html/cadastros/lib/Connection.php';
include '/var/www/html/cadastros/config/autoload.php';

$classeController = $_POST['modulo'] . 'Controller';
$classeController = ucfirst($classeController);
$caminho = 'app/controller/' . $classeController . '.php';
$metodo = $_POST['operacao'];

// Duas classes para lidar com solicitação e resposta (Request e Response)
// 

try {
    if (is_readable($caminho) === false) {
        throw new Exception('Modulo ' . $_POST['modulo'] . ' não existe.');
    }

    $objController = new $classeController;

    if (method_exists($objController, $metodo) === false) {
        throw new Exception('Operacao ' . $metodo . ' não existe.');
    }

    $objController->$metodo();

} catch (Exception $e) {
    $response = ['erro' => true, 'mensagem' => $e->getMessage()];
    echo json_encode($response);
}
