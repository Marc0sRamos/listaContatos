
$(document).on('click', '#btn-acessar', function (e){
    e.preventDefault();
    alert('oi')
    var dados = {
        nomeUsuario: document.getElementById("email-login").value,
        senha: document.getElementById("senha-login").value
      };
      var dadosJSON = JSON.stringify(dados);
      console.log(dados)
})

