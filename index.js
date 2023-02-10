setTimeout(() => {
	$(document).ready(function () {
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
	let argumentos = {
		'rota': $(this).attr('nome-rota'),
		'callback': $(this).attr('callback')
	}
	carregarPagina(argumentos);
});


function carregarPagina(argumentos) {
	$("#main").load(rotas[argumentos.rota][0], function () {

		$('.telefone').mask('(99) 99999-999?9');

		if (argumentos.rota === 'home') {
			let home = new Home();

			if (typeof home[argumentos.callback] === 'function') {
				// home[callback]();
				home.listarContatos();
			}
		};

		if (argumentos.rota === 'cadastro') {
			let formulario = new Formulario();
			formulario.povoarSelectMunicipio();

			if (typeof formulario[argumentos.callback] === 'function') {
				formulario.preencherFormulario(argumentos.id);
				// idContato = argumentos.id
			}

			"use strict";

			var snackbarContainer = document.querySelector('#demo-toast-example');
			// var showToastButton = document.querySelector('#demo-show-toast');

			$("#main").on("click", "#demo-show-toast", function() {
				alert ('adf');
				var data = { message: 'Example Message # ' };
				snackbarContainer.MaterialSnackbar.showSnackbar(data);
			});

			// showToastButton.addEventListener('click', function () {
			// 	'use strict';
			// 	var data = { message: 'Example Message # ' };
			// 	snackbarContainer.MaterialSnackbar.showSnackbar(data);
			// });
		}
	});
}




