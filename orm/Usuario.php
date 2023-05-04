<?php
$dados = $_POST['dados'];
$validarUsuario = new Usuario($pdo);
$validarUsuario->validarLogin($dados);


class Usuario
{
    private $pdo;

    function __construct($pdo)
    {
        $this->pdo = include './conection.php';
    }

    public function validarLogin($dados)
    {
        $response = ['erro' => false, 'mensagem' => '', 'dados' => []];

        try {
            $this->pdo->beginTransaction();

            $usuarioLogin = $dados['nomeUsuario'];
            $sqlSelectLogin = "SELECT login FROM login WHERE login = '$usuarioLogin'";
            $selectLogin = $this->pdo->query($sqlSelectLogin);

            if ($selectLogin->rowCount() < 1) {
                $response ['mensagem'] = 'Usuario invalido!';
                throw new Exception('Erro capturado');
            }

            $senha = md5($dados['senha']);
            $sqlSelectSenha = "SELECT senha FROM login WHERE senha = '$senha'";
            $selectSenha = $this->pdo->query($sqlSelectSenha);

            if ($selectSenha->rowCount() < 1) {
                $response ['mensagem'] = 'Senha invalida!';
                throw new Exception('erro capturado');                
            }

            $sqlSelectID = "SELECT id_usuario FROM login WHERE login = '$usuarioLogin'";
            $selectId = $this->pdo->query($sqlSelectID);
            $resultSelectId = $selectId->FetchAll(PDO::FETCH_ASSOC);
            $response['dados'] = $resultSelectId[0];

            $this->pdo->commit();

        } catch (Exception $e) {
            $this->pdo->rollback();
            $response['erro'] = true;
        }

        $json = json_encode($response);
        echo $json;
    }
}
