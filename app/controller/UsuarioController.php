<?php

class UsuarioController
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = connect();

    }

    public function validarLogin()
    {
        $dados = $_POST['dados'];
        $response = new Response;

        try {

            $usuarioModel = new UsuarioModel;
            $usuarioLogin = $dados['nomeUsuario'];
            $senha = md5($dados['senha']);
            $dadosUsuario = $usuarioModel->getByLoginSenha($usuarioLogin, $senha);

            if (empty($dadosUsuario)) {
                throw new Exception("Usuario ou senha inválido");
            }

            $response->setDados($dadosUsuario);

        } catch (Exception $e) {
            $response->setErro();
            $response->setMensagem($e->getMessage());
        }

        $response->print();
    }
}
