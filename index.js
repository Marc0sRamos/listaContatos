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
		formulario.povoarSelectMunicipio;
		limpar()
		if (typeof formulario[argumentos.callback] === 'function') {
			formulario.preencherFormulario(argumentos.id);
		}
	}


}






