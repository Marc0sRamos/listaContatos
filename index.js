setTimeout(() => {
	$(document).ready(function(){
		let home = new Home()
	
		home.listarContatos()			
	})
}, 500);




const rotas = {
	"home": [
		"home/home.html",
		// "home/home.css",

	],

	"cadastro": [
		"cadastro/cadastro.html",
	]
};

const usuario = {
	"codigo": 22671,
	"nome": "Marcos Tulio",
};


	$("body").on('click', '.navegacao', function () {
		let nomeRota = $(this).attr('nome-rota');
		let callback = $(this).attr('callback');
		// console.log(callback)
		carregarPagina(nomeRota, callback);
	});


function carregarPagina(rota, callback)
{
	$("#main").load(rotas[rota][0], function () {

		$('.telefone').mask('(99) 99999-999?9');
		
		if (rota === 'home') {
			let home = new Home();

			if (typeof home[callback] === 'function') {
				// home[callback]();
				home.listarContatos()
			}
		}

		if (rota === 'cadastro') {
				let f = new Formulario();
				f.povoarSelectMunicipio();
		}
	});
}	




