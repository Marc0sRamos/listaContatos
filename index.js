var cidadesBanco = {}

const rotas = {
	"home": [
		"/cadastros/home/home.html",
	],

	"cadastro": [
		"/cadastros/cadastro/cadastro.html",
	]
};

const usuario = {
	"codigo": 22671,
	"nome": "Marcos Tulio",
};

$(document).ready(function () {
	getMunicipiosAjax()
		.then((cidades) => {
			cidadesBanco = cidades
			carregarPaginaHome()
		})
});

var dialog = document.querySelector('dialog');
var showDialogButton = document.querySelector('#show-dialog');
if (!dialog.showModal) {
	dialogPolyfill.registerDialog(dialog);
}
showDialogButton.addEventListener('click', function () {
	dialog.showModal();
});
dialog.querySelector('.close').addEventListener('click', function () {
	dialog.close();
});

var teste = document.getElementsByClassName("mdl-dialog__content").value = 'oiusa'
var teste2 = document.te("Meu texto vai aqui");
teste.appendChild(teste2)

document.getElementById("meu_target").appendChild(teste)


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
		var homeMain = document.getElementById("homeMain");
		homeMain.style.display = 'flex';
		var cadastroMain = document.getElementById('cadastroMain');
		cadastroMain.style.display = 'none';

		let home = new Home();

		if (typeof home[argumentos.callback] === 'function') {
			home.listarContatos();
		}

	}
	else if (argumentos.rota === 'cadastro') {

		var cadastroMain = document.getElementById("cadastroMain");
		cadastroMain.style.display = 'flex';
		var homeMain = document.getElementById("homeMain");
		homeMain.style.display = 'none';

		let formulario = new Formulario();
		limpar()
		formulario.povoarSelectMunicipio();

		if (typeof formulario[argumentos.callback] === 'function') {
			limpar()
			formulario.preencherFormulario(argumentos.id);
		}

	}
}

$(document).on('click', '#button-home--cadastro', function () {

	var cadastroMain = document.getElementById("cadastroMain");
	cadastroMain.style.display = 'flex';
	var homeMain = document.getElementById("homeMain");
	homeMain.style.display = 'none';

	let formulario = new Formulario();
	formulario.povoarSelectMunicipio();
	limpar()

})


$(document).on('click', '#button-cadastro--home', function () {

	var homeMain = document.getElementById("homeMain");
	homeMain.style.display = 'flex';
	var cadastroMain = document.getElementById('cadastroMain');
	cadastroMain.style.display = 'none';

	let home = new Home();

	if (typeof home[argumentos.callback] === 'function') {
		home.listarContatos();
	}

})






