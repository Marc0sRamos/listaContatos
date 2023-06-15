var cidadesBanco = {}

const rotas = {
	"home": [
		"app/view/home/home.html",
	],

	"cadastro": [
		"app/view/cadastro/cadastro.html",
	]
};

$(document).ready(function () {
	getMunicipiosAjax()
		.then((cidades) => {
			cidadesBanco = cidades
			carregarPaginaHome()
		})
	carregarInconsistencias(false)

});

$("body").on('click', '.navegacao', function () {
	let argumentos = {
		'rota': $(this).attr('nome-rota'),
		'callback': $(this).attr('callback')
	}
	carregarPagina(argumentos);
});

function carregarPagina(argumentos) {
	$('.telefone').mask('(99) 99999-999?9');

	if (argumentos.rota === 'home') {
		exibirPaginaHome(argumentos);
	}
	else if (argumentos.rota === 'cadastro') {
		exibirPaginaCadastro(argumentos)
	}
}

$(document).on('click', '#button-home--cadastro', function () {
	exibirPaginaCadastro()
})

$(document).on('click', '#button-cadastro--home', function () {
	exibirPaginaHome()
})

$(document).on('click', '#button-erros', function () {
	var homeMain = document.getElementById("homeMain");
	homeMain.style.display = 'none';
	var cadastroMain = document.getElementById('cadastroMain');
	cadastroMain.style.display = 'none';
	var inconsistenciaMain = document.getElementById('errosMain');
	inconsistenciaMain.style.display = 'flex';
})

$(document).on('click', '#btn-sincronizar', function () {
	getContatosDB()
	deletarContatosDB()
	salvarContatosDB()
})

function carregarInconsistencias(erros) {
	if (erros === false) {
		var inconsistenciaMain = document.getElementById('button-erros');
		inconsistenciaMain.style.display = 'none';
	} else {
		var inconsistenciaMain = document.getElementById('button-erros');
		inconsistenciaMain.style.display = 'flex';
	}
}

function exibirPaginaHome(argumentos) {
	definirDisplay('none', 'flex', 'none')

	if (typeof new Home()[argumentos.callback] === 'function') {
		new Home().listarContatos();
	}
}

function exibirPaginaCadastro(argumentos) {
	definirDisplay('flex', 'none', 'none');

	let formulario = new Formulario();
	formulario.povoarSelectMunicipio();
	limparInput()

	if (typeof formulario[argumentos.callback] === 'function') {
		formulario.preencherFormulario(argumentos.id);
	}
}

function definirDisplay(displayCadastro, displayHome, displayErros) {
	document.getElementById("cadastroMain").style.display = displayCadastro;
	document.getElementById("homeMain").style.display = displayHome;
	document.getElementById("errosMain").style.display = displayErros;
}


