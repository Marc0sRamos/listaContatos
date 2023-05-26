<?php

class Response
{
    /**
     * @var boolean
     */
    private $erro = false;

    /**
     * @var string
     */
    private $mensagem;

    /**
     * @var array
     */
    private $dados = [];

    public function setErro()
    {
        $this->erro = true;
    }

    public function setMensagem(string $mensagem)
    {
        $this->mensagem = $mensagem;
    }

    public function setDados( $dados) 
    {
        $this->dados = $dados;
    }

    public function print()
    {
        echo json_encode([
            'erro' => $this->erro,
            'mensagem' => $this->mensagem,
            'dados' => $this->dados
        ]);
    }
}