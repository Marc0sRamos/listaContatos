<?php

class Usuario
{
    private $pdo;

    function __construct($pdo)
    {
        $this->pdo = include './conection.php';
    }

    public function validarLogin($login, $senha)
    {
        // Conectar ao banco de dados
        $conn = new PDO("mysql:host=localhost;dbname=nomeDoBanco", "usuario", "senha");

        // Preparar a consulta SQL
        $stmt = $conn->prepare("SELECT * FROM login WHERE login = :login");
        $stmt->bindParam(':login', $login);

        // Executar a consulta
        $stmt->execute();

        // Verificar se o login existe e se a senha está correta
        $row = $stmt->fetch();
        if ($row && password_verify($senha, $row['senha'])) {
            // Login válido, retornar o ID do usuário
            return $row['id_usuario'];
        } else {
            // Login inválido
            return false;
        }
    }
}
