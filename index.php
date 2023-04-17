<!DOCTYPE html>
<html lang="pt-br">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" href="#">
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-orange.min.css" />
	<link rel="stylesheet" href="index.css">
	<link rel="stylesheet" href="/cadastros/cadastro/cadastro.css">
	<link rel="stylesheet" href="/cadastros/home/home.css">
	<link rel="stylesheet" href="/cadastros/inconsistencia/erros.css">
	<script src="/cadastros/lib/jquery-3.6.1.min.js"></script>
	<script src="/cadastros/lib/jquery-maskedinput/src/jquery.maskedinput.js"></script>
	<script src="/cadastros/mdl/material.js"></script>
	<link href="lib/css/select2.min.css" rel="stylesheet" />
	<script src="lib/js/select2.min.js"></script>
	<script src="lib/js/pt-BR.js"></script>
	<script src="lib/funcoes.js"></script>
	<title>ICS Contatos</title>
</head>

<body>
	<div class="demo-layout mdl-layout mdl-js-layout  mdl-layout--fixed-header ">
		<header class="mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-900">
			<div class="mdl-layout__header-row">
				<img id="img-ctt" src="/cadastros/imagens/contacts_2022_48dp.png" alt="">
				<span class="mdl-layout-title">Contatos</span>
			</div>
		</header>

		<div class="demo-drawer mdl-layout__drawer  mdl-color-text--blue-grey-50">
			<i class="demo-drawer-header"> </i>
			<img src="/cadastros/imagens/logo-ics.png" class="demo-avatar">
			<div class="demo-avatar-dropdown">
				<div class="mdl-layout-spacer"></div>
			</div>
			<nav class="demo-navigation mdl-navigation mdl-color--blue-grey-">
				<a id="home" class="mdl-navigation__link navegacao" nome-rota="home" callback="listarContatos">
					<i class="material-icons" role="presentation">home</i>Home
				</a>
				<a class="mdl-navigation__link navegacao" nome-rota="cadastro" callback="preencherFormulario">
					<i class="material-icons" role="presentation">add</i>Criar novo contato
				</a>
			</nav>
		</div>
	</div>


	<div id="imagem-logo">
		<img id="img-logo" src="/cadastros/imagens/logo-ics.png" alt="">
	</div>


	<div id="container_incosistencias">
			<button id="button-erros" type="button" class="mdl-button" >Incosistencias!</button>
	</div>

	<div class="mdl-layout__content" id="main">
		<div class="mdl-layout__content">
			<div id="homeMain">
				<?php
				include 'home/home.html';
				?>
			</div>
			<div id="cadastroMain">
				<?php
				include 'cadastro/cadastro.html'
				?>
			</div>
			<div id="errosMain">
				<?php
				include 'inconsistencia/erros.html'
				?>
			</div>
		</div>
	</div>

</body>
<script src="index.js"></script>

<script src="lib/funcoes.js"></script>
<script src="cadastro/contatoModel.js"></script>
<script src="cadastro/cadastro.js"></script>
<script src="home/home.js"></script>

</html>