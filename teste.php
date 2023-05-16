<?php

use ContatoModel as GlobalContatoModel;

class ContatoModel
{
    public function get(int $id): array
    {
        return [];
    }
}


$contato = new contatoModel;
$teste = [100, 'cachorro'];






// var_dump($teste);
echo "<br><br>";
var_dump($contato);
echo "<br><br>";

class Paciente
{
    public function __construct($nome, $sexo, $idade, $altura, $peso, $cpf, $rg, $cns)
    {
        $this->nome = $nome;
        $this->sexo = $sexo;
        $this->idade = $idade;
        $this->altura = $altura;
        $this->peso = $peso;
        $this->cpf = $cpf;
        $this->rg = $rg;
        $this->cns = $cns;
    }
}


function imprimirPaciente(stdClass $paciente)
{
    echo implode('<br>', get_object_vars($paciente));
}

$paciente = new Paciente('Maria', 'F', 35, 1.70, 100, '02166552215', '5014147', '501235000145245');

$contatos = '[{"nome": "Maria", "sexo": "F", "idade": 35},{"nome": "Jose", "sexo": "M", "idade": 45}]';

var_dump(json_decode($contatos));

$paciente = new stdClass;
$paciente->nome = 'Maria Costa';
$paciente->nomeDaFilha = 'Mariana';



// var_dump($paciente);
// echo "<br><br>";

imprimirPaciente($exame);
echo "<br><br>";
// var_dump($paciente);