<?php
include 'Circulo.php';
$circulo = new Circulo;

echo 'O comprimento do circulo é ' . $circulo->comprimentoCirculo(5);
echo '<br>';

echo 'A area do circulo é ' . $circulo->areaCirculo(5);