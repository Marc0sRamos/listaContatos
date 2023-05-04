
var id_usuario = {
	"codigo": localStorage.getItem('id_usuario')
};
// console.log(usuario.codigo)

$(document).on('click', '#btn-acessar', function (e) {
  e.preventDefault();
  var dados = {
    nomeUsuario: document.getElementById("email-login").value,
    senha: document.getElementById("senha-login").value
  };
  acessarSistema(dados)
})

function acessarSistema(dados) {
  return new Promise((resolve, reject) => {

    jQuery.ajax({
      url: '/cadastros/orm/Usuario.php',
      data: { 'modulo': 'Usuario', 'operacao': 'validarLogin', 'dados': dados },
      type: 'POST',
      async: true,
      dataType: 'json',

      success: function (response) {
        if (response.erro === false) {
          resolve('Acesso liberado');
          localStorage.setItem('id_usuario', response.dados['id_usuario']);
          window.location.href = '/cadastros'
        } else {
          console.log('erro');
          getErrosLogin(response)
          reject(response);
        }
      },
    });
  })
}
