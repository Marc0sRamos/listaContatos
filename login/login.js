
var id_usuario = {
  "codigo": localStorage.getItem('id_usuario')
};

$(document).on('click', '#btn-acessar', function (e) {
  e.preventDefault();
  var dados = {
    nomeUsuario: document.getElementById("email-login").value,
    senha: document.getElementById("senha-login").value
  };
  acessarSistema(dados)
})

function acessarSistema(dados) {
  jQuery.ajax({
    url: '/cadastros/ajax.php',
    data: { 'modulo': 'usuario', 'operacao': 'validarLogin', 'dados': dados },
    type: 'POST',
    async: true,
    dataType: 'json',

    success: function (response) {

      if (response.erro === true) {
        erroLogin('Usuario ou senha invalido');
        return;
      }

      localStorage.setItem('id_usuario', response.dados['id_usuario']);
      window.location.href = '/cadastros'
    },
  });
}

function erroLogin(mensagem) {
  var dialog = document.getElementById('dialog');
  dialog.showModal();

  document.querySelector('#mensagem-erro2').textContent = (mensagem);

  dialog.querySelector('.close').addEventListener('click', function () {
    dialog.close();
  });
}
