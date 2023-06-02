<?php

class Calculadora_old
{
    public static $ultimoResultado;

    public static function somar(float $n1, float $n2)
    {
        self::$ultimoResultado = $n1 + $n2;
        return self::$ultimoResultado;
    }

    public static function subtrair(float $n1, float $n2)
    {
        self::$ultimoResultado = $n1 - $n2;
        return self::$ultimoResultado;
    }

    public static function dividir(float $n1, float $n2)
    {
        self::$ultimoResultado = $n1 / $n2;
        return self::$ultimoResultado;
    }

    public static function multiplicacao(float  $n1, float $n2)
    {
        self::$ultimoResultado = $n1 * $n2;
        return self::$ultimoResultado;
    }

    public static function getUltimoResultado()
    {
        return self::$ultimoResultado;
    }
}
