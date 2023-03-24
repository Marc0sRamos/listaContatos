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
}