<?php
// phpinfo();

include 'Calculadora.php';

echo 'O valor da soma é ' . (new Calculadora(80, 20))->somar();
echo '<br>';
// 100

echo 'O valor da subtração é ' . (new Calculadora())->subtrair(100);
echo '<br>';
// 0

echo 'Ultimo resultado: ' . (new Calculadora())->getUltimoResultado();
echo '<br>';
// 0

echo '<br>O valor da divisão é ' . (new Calculadora())->dividir(0) . "<br>";
var_dump((new Calculadora())->dividir(0));

// 15
// $calculadora = new Calculadora(20);
// echo 'Ultimo resultado: ' . $calculadora->getUltimoResultado() . "<br>";

// echo 'O valor da subtração é ' . (new Calculadora(0))->subtrair(0,15);
// echo '<br>';



// echo 'O valor da divisão é ' . (new Calculadora(50, 2))->dividir() . "<br>";
// // 25

// echo 'O valor da subtração é ' . (new Calculadora(5))->subtrair();
// echo '<br>';
// 20


die;

// echo 'Ultimo resultado: ' . $calculadora->getUltimoResultado();
// echo '<br>';


// echo 'O valor da subtração é ' . $calculadora->subtrair();
// echo '<br>';

// $calculadora = new Calculadora(30);
// echo 'O valor da multiplicação é ' . $calculadora->multiplicacao();
// echo'<br>';

// $calculadora = new Calculadora(900);
// echo 'O valor da divisão é ' . $calculadora->dividir();
// echo '<br>';





