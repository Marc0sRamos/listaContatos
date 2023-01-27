$("body #main").on("click", "#add", function (e) {
    let idTelefone = (new String(Math.random())).split('.')[1];
    e.preventDefault();

    let inputTelefone = document.createElement('input');
    inputTelefone.setAttribute('class', 'campo-nome mdl-textfield__input telefone');
    inputTelefone.setAttribute('id', idTelefone)
    inputTelefone.classList.add('input_novo');
    document.getElementById('telefone-ctt').appendChild(inputTelefone);

    let btnremover = document.createElement('button');
    btnremover.setAttribute('class', 'mdl-button mdl-button--fab mdl-button--mini-fab btn-remover remove');
    btnremover.innerHTML = '<i class="material-icons">remove</i>'
    btnremover.setAttribute('id-telefone', idTelefone);
    document.getElementById('telefone-ctt').appendChild(btnremover);
    $('.telefone').mask('(99) 99999-999?9');
});

$('body #main').on("click", ".remove", function(){    
    document.getElementById($(this).attr('id-telefone')).remove();
    $(this).remove()
});

class Contato {

    constructor(nome, sexo, telefone, email, municipio, observacao) {
        this.nome = nome;
        this.sexo = sexo;
        this.telefone = telefone;
        this.email = email;
        this.municipio = municipio;
        this.observacao = observacao;
        this.codigoContato = uuidv4();
        this.idUsuarioInsert = usuario.codigo;
        this.dataInsert = Date.now();
    }
}

class Formulario {

    povoarSelectEstado() {
        var select = document.getElementById('estadosCadastro')
    }


    povoarSelectMunicipio() {
        var select = document.getElementById('municipiosCadastro')

        municipiosBaseRemota.forEach(function (municipio, indice) {

            let option = document.createElement('option');
            option.setAttribute('value', municipio.codigoIbge);
            option.setAttribute('class', 'selectOption')
            option.innerHTML = "(" + municipio.uf + ") " + municipio.nomeCidade
            select.appendChild(option);
        })

            $('#municipiosCadastro').select2({
                placeholder: "Selecione o municipio",
                allowClear: true, 
                minimumInputLength: 3,
                language: "pt-BR"
        });
       
    };

    filtrarNome(nome) {
        return nome.trim();
    };

    filtrarEmail(email) {
        return email.trim();
    };

    filtrarObservacao(observacao) {
        return observacao.trim();
    };

    salvar() {
        // hidrata o objeto contato
        this.hidratar();
        // filtra os atributos do objeto contato
        this.filtrar();
        // valida os atributos do objeto contato
        this.validar();
        // salva no banco
        let modelContato = new ContatoModel;
        modelContato.adicionar(this.contato);
        this.limpar();
    };

    hidratar() {

        let nome = document.getElementById('nome-ctt').value;
        let sexo = document.querySelector('input[name="sexo"]:checked').value;
        let telefone = [];

        $.each(document.getElementsByClassName('telefone'), function (indice, input) {
            telefone[indice] = input.value;
        });

        let email = document.getElementById('email-ctt').value;
        let municipio = document.getElementById('municipiosCadastro').value;
        let observacao = document.getElementById('obs-ctt').value;
        this.contato = new Contato(nome, sexo, telefone, email, municipio, observacao);
    };

    filtrar() {
        var telefone = [];
        this.contato.nome = this.filtrarNome(this.contato.nome);
        this.contato.email = this.filtrarEmail(this.contato.email);
        this.contato.observacao = this.filtrarObservacao(this.contato.observacao);
        this.contato.municipio = document.getElementById('municipiosCadastro').value;
        this.contato.telefone.forEach(function (value, indice) {
            telefone.push(soNumero(value));
        });
        this.contato.telefone = telefone
    };

    validar() {
        try {

            if (validarNomeCidadao(this.contato.nome) === false) {
                throw 'O nome do contato é inválido';
            }

            if (validarSexo(this.contato.sexo) === false) {
                throw 'O sexo é invalido'
            }

            this.contato.telefone.forEach(function (value, indice) {
                if (validarTelefone(value) === false) {
                    throw 'O telefone ' + value + ' é invalido';
                };
            });

            if (validarEmail(this.contato.email) === false) {
                throw 'O endereço de email é inválido';
            }

            return true;

        } catch (mensagem) {
            exibirMensagemDeErro(mensagem);
            return false;
        }
    };

    limpar(){
    $(":input").val(""); 
    };

    excluir() {
      let contatoModel = new ContatoModel;
      contatoModel.remover(this.contato)     
    }
}

// $(document).on('click', '#municipiosCadastro', function () {
//     let f = new Formulario();
//     f.povoarSelectMunicipio();
// });

// $(document).ready(function () {
//     let f = new Formulario();
//     f.povoarSelectMunicipio();
// });

$(document).on('click', '#btn-salvar', function(e) {
    e.preventDefault();
    var formulario = new Formulario;
    formulario.salvar();
});


$(document).on('click', '#btn-excluir', function(e) {
    e.preventDefault();
    var formulario = new Formulario;
    formulario.excluir();
});


// function gerarContatos() {
// let nome = gerarNomeAleatorio()

// let contatoGerado = new Contato(
//     nome, 'M', gerarNumero(), gerarEmail(nome), getMunicipios(), gerarObservação()
// );

// console.log(nome)
// let modelContato = new ContatoModel;
//     modelContato.adicionar(contatoGerado);

// }

// function gerarNomeAleatorio() {

//     let quantidadeDeSilabas=getRandomIntInclusive(2,3);
//     let nome="";
  
//     for (contadorSilaba=1;contadorSilaba<=quantidadeDeSilabas;contadorSilaba++){
  
//       nome=nome +  getConsoanteAleatoria() + getVogalAleatoria() ;
  
//     }
//     // console.log(nome)  
//     return nome;
// };
  
// function getRandomIntInclusive(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// };
  
// function getVogalAleatoria(){
  
//     let listaVogais="AEOIU";
//     let numeroAleatorio=getRandomIntInclusive(1, 5);
  
//     return listaVogais.substring(numeroAleatorio-1,numeroAleatorio);
  
// };
  
// function getConsoanteAleatoria(){
  
//     let listaConsoantes="BCDFGHJKLMNPQRSTWVXYZ";
//     let numeroAleatorio=getRandomIntInclusive(1, 21);
  
//     return listaConsoantes.substring(numeroAleatorio-1,numeroAleatorio);
  
// };

// function gerarNumero() {
//     let numero = [0,1,2,3,4,5,6,7,8,9]
//     let telefone = ''
//     for (var i = 0; i < 11; i++) {
//          telefone += numero[Math.floor(Math.random() * 9)] ;
//     }

//     return telefone
// };

// function gerarEmail(nome) {
//     let dominios = ['@gmail.com', '@outlook.com', '@icsgo.com.br']
//     let email = nome + Math.random().toString()  + dominios[Math.floor(Math.random() * dominios.length)];

//     return email
// };


// function getIbge () {
//     let codigosIbge = []

//     municipiosBaseRemota.forEach(function(municipio, indice) {

//     codigosIbge[indice] = municipio.codigoIbge

//     })

//     return  codigosIbge
// }

// function getMunicipios() {
//     var codigoIbge = getIbge()
//     let codigo = codigoIbge[Math.floor(Math.random() * codigoIbge.length)]
//     return codigo
// };


// function gerarObservação() {
//     let observacao = gerarNomeAleatorio().toLowerCase()

//     return observacao
// }


// function forContatos() {
//     for (let i = 0; i < 9998; i++) {
//         gerarContatos()
//     }
// }