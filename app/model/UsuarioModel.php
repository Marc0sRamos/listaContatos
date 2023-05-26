<?php


class UsuarioModel extends Model
{
    public function getByLoginSenha(string $login, string $senha)
    {
        $usuario = [];

        $result = $this->pdo->query(
            "SELECT * FROM usuario WHERE login = '$login' AND senha = '$senha'"
        );
    
        $usuario = $result->Fetch(PDO::FETCH_ASSOC);
        return $usuario;
    }
}
