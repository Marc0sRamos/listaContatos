const rotas = {
	"home": [
		"/cadastros/home/home.html",
		// "home/home.css",
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
		// 'callback': $(this).attr('callback')
	}
	carregarPagina(argumentos);
});

function carregarPagina(argumentos) {
	if (argumentos.rota == 'home') {
		var home = document.getElementById("homeMain")
		home.style.display = 'flex'
		var cadastro = document.getElementById('cadastroMain');
		cadastro.style.display = 'none'

	} else if (argumentos.rota == 'cadastro') {
		var cadastro = document.getElementById("cadastroMain");
		cadastro.style.display = 'flex'
		var home = document.getElementById("homeMain")
		home.style.display = 'none'
	}
	
}



// function carregarPagina(argumentos) {
// 	$("#main").load(rotas[argumentos.rota][0], function () {

// 		$('.telefone').mask('(99) 99999-999?9');

// 		if (argumentos.rota === 'home') {
// 			let home = new Home();

// 			if (typeof home[argumentos.callback] === 'function') {
// 				home.listarContatos();
// 			}
// 		};

// 		if (argumentos.rota === 'cadastro') {
// 			let formulario = new Formulario();
// 			formulario.povoarSelectMunicipio();

// 			if (typeof formulario[argumentos.callback] === 'function') {
// 				formulario.preencherFormulario(argumentos.id);
// 			}
// 		}
// 	});
// }




