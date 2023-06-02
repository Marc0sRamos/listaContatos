<?php

class ContatoFilter
{
    function filtrarNome(string $contatoNome)
    {
        return htmlspecialchars(trim($contatoNome));
    }

    function filtrarEmail(string $contatoEmail)
    {
        return htmlspecialchars(trim($contatoEmail));
    }

    function filtrarObs(string $contatoObservacao)
    {
        return htmlspecialchars(trim($contatoObservacao));
    }

    public function filtrar($contato)
    {
        $this->filtrarEmail($contato->email);
        $this->filtrarNome($contato->nome);
        $this->filtrarObs($contato->observacao);
    }
}
