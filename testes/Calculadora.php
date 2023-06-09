<?php

class Calculadora
{
    private static $ultimoResultado;
    public $n1;
    public $n2;

    function __construct(float $numero1 = 0, float $numero2 = 0)
    {
        $this->n1 = $numero1;
        $this->n2 = $numero2;

        if ($numero2 === (float) 0) {
            $this->n2 = self::$ultimoResultado;
        }
    }

    public function somar()
    {
        self::$ultimoResultado = $this->n1 + $this->n2;
        return self::$ultimoResultado;
    }

    public function subtrair(float $subtraendo, float $minuendo = 0)
    {
        if ($minuendo === (float) 0) {
            $minuendo = self::$ultimoResultado;
        }

        self::$ultimoResultado = $minuendo - $subtraendo;
        return self::$ultimoResultado;
    }
    
    public function dividir(float $divisor, float $dividendo = 0)
    {
        if ($dividendo === (float) 0) {
            $dividendo = self::$ultimoResultado;
        }

        if ($divisor === (float) 0) {
            echo 'Não é possivel realizar um divisão por 0';
        } else {
            self::$ultimoResultado = $dividendo / $divisor;
            return self::$ultimoResultado;
        }
    }

    public function multiplicacao()
    {
        self::$ultimoResultado = $this->n1 * $this->n2;
        return self::$ultimoResultado;
    }

    public function getUltimoResultado()
    {
        return self::$ultimoResultado;
    }
}
