<?php

class Circulo
{
    public $resultado;
    public const PI = 3.14;
    
    public function comprimentoCirculo(float $raio)
    {
        return $this->resultado = 2 * self::PI * $raio;
    }

    public function areaCirculo(float $raio)
    {
        return $this->resultado = self::PI * $raio ** 2;
    }
}