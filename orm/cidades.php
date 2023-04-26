<?php

include './loadOrm.php';

class Cidade
{

	public function getCidade(PDO $pdo)
	{
		$sql = "SELECT * FROM cidade";
		$cidades = select($pdo, $sql);
		return	json_encode($cidades);
	}

}

$teste = new Cidade;
echo $teste->getCidade($pdo);
