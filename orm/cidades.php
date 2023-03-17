<?php

include './loadOrm.php';

class Cidade
{

	public function getCidade(PDO $pdo)
	{
		$sql = "SELECT * FROM cidade";
		$cidades = select($pdo, $sql);
		return	json_encode($cidades);
		// var_dump(json_encode($cidades));

		// $cidadesJson = json_encode($cidades);
		// return $cidadesJson;
	}

}

// die('aqui');
$teste = new Cidade;
echo $teste->getCidade($pdo);
