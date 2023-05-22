<?php

class CidadeController
{
	public function getCidade()
	{
		$cidade = new CidadeModel();
		echo json_encode($cidade->getCidadeALL());
	}

}

