<?php

function carregaTudo(string $classe): void
{
    // montar o caminho para a classe
    $url = '/var/www/html/cadastros/app/model/' . $classe . '.php';
    $url2 = '/var/www/html/cadastros/app/filters/' . $classe . '.php';
    $url3 = '/var/www/html/cadastros/app/controller/' . $classe . '.php';
    $url4 = '/var/www/html/cadastros/lib/' . $classe . '.php';

    // checar se o caminho (file_exists)
    if (file_exists($url)) {
        include $url;
    } elseif (file_exists($url2)) {
        include $url2;
    } elseif (file_exists($url3)) {
        include $url3;
    } elseif (file_exists($url4)) {
        include $url4;
    } 
}

spl_autoload_register('carregaTudo');
