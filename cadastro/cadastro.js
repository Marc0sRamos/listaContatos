$("body #main").on("click", "#add", function (e) {
    e.preventDefault();
    var idTelefone = criarInputTelefone()
    criarBotaoRemover(idTelefone)
});


$('body #main').on("click", ".remove", function (e) {
    e.preventDefault();
    console.log(document.getElementById($(this).attr('id-telefone')))
    document.getElementById($(this).attr('id-telefone')).remove();
    $(this).remove()
});

class Contato {

    constructor(nome, sexo, telefone, email, municipio, observacao, codigoContato, idUsuario, dataInsert, status) {
        this.nome = nome;
        this.sexo = sexo;
        this.telefone = telefone;
        this.email = email;
        this.municipio = municipio;
        this.observacao = observacao;
        this.codigoContato = codigoContato;

        this.idUsuarioInsert = idUsuario

        if (this.dataInsert === undefined) {
            this.dataInsert = Date.now()
        } else {
            this.dataInsert = dataInsert
        }
        
        this.status = 'ativo'
    }

}

class Formulario {

    povoarSelectMunicipio() {
        var select = document.getElementById('municipiosCadastro')

        Object.keys(cidadesBanco).forEach(function (indice) {
            let option = document.createElement('option');
            option.setAttribute('value', indice);
            option.setAttribute('class', 'selectOption')
            option.innerHTML = cidadesBanco[indice].uf + " - " + cidadesBanco[indice].municipio
            select.appendChild(option);
        });

        $('#municipiosCadastro').select2({
            placeholder: "Selecione o municipio",
            allowClear: true,
            minimumInputLength: 3,
            language: "pt-BR"
        });

    };

    hidratar() {
        let nome = document.getElementById('nome-ctt').value;
        let sexo;

        if (document.getElementById('option-1').checked == true) {
            sexo = document.getElementById('option-1').value = 'M'
        } else if (document.getElementById('option-2').checked == true) {
            sexo = document.getElementById('option-2').value = 'F'
        }

        let telefone = [];

        $.each(document.getElementsByClassName('telefone'), function (indice, input) {
            telefone[indice] = input.value;
        });
        let email = document.getElementById('email-ctt').value;
        let municipio = document.getElementById('municipiosCadastro').value;
        let observacao = document.getElementById('obs-ctt').value;
        let codigoContato = document.getElementById('id-contato').value;

        if (codigoContato.length !== 36) {
            codigoContato = uuidv4()
        }

        let status = document.getElementById('statusExcluido').value = 'ativo'
    
        let idUsuario = localStorage.getItem('id_usuario');

        this.contato = new Contato(nome, sexo, telefone, email, municipio, observacao, codigoContato, idUsuario, status);

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

    filtrarTelefone(telefone) {
        return soNumero(telefone)
    }

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

    salvar() {
        this.hidratar();
        this.filtrar();
        this.validar();
        var idContato = document.getElementById('id-contato').value;

        if (idContato.length !== 36) {
            let modelContato = new ContatoModel;
            modelContato.adicionar(this.contato)
                .then((mensagem) => {
                    exibirMensagemSucesso(mensagem);
                    limpar()
                })
        } else {
            let modelContato = new ContatoModel;
            modelContato.atualizar(this.contato)
                .then((mensagem) => {
                    mensagemAtualizado(mensagem);
                })
                .catch((erro) => {
                    console.log(erro);
                })
        }
    };

    excluir(idContato, status) {
        if (status = 'ativo') {
            var contatoEdit = []
            contatoEdit = getContato(idContato).then((contato) => {
                console.log(contato);
                console.log(contato.excluido)
                contato.status = 'excluido';
                console.log(contato)
                let modelContato = new ContatoModel;
                modelContato.atualizar(contato)
                    .then((mensagem) => {
                        mensagemAtualizado('O contato será excluido apos a sincronização');
                    })
                    .catch((erro) => {
                        console.log(erro);
                    })
            })

        }
    }

    preencherFormulario(idContato) {
        let contatoEdit = {}

        contatoEdit = getContato(idContato).then((contato) => {
            document.getElementById('id-contato').value = contato.codigoContato;
            document.getElementById('statusExcluido').value = contato.status
            document.getElementById('id-usuario').value = contato.idUsuarioInsert
            document.getElementById('nome-ctt').value = contato.nome;

            if (contato.sexo === 'M') {
                var radioM = document.getElementById('option-1');
                radioM.checked = true
                var radioF = document.getElementById('option-2');
                radioF.checked = false
            } else if (contato.sexo === 'F') {
                var radioM = document.getElementById('option-1');
                radioM.checked = false;
                var radioF = document.getElementById('option-2');
                radioF.checked = true

            }

            removerInputTelefone()

            hidratarTelefone(0, contato)
            if (contato.telefone.length > 1) {
                for (var indice = 1; indice < contato.telefone.length; indice++) {
                    var idTelefone = criarInputTelefone()
                    criarBotaoRemover(idTelefone)
                    hidratarTelefone(indice, contato)
                }
            }

            $("#municipiosCadastro").val(contato.municipio).trigger('change');
            document.getElementById('email-ctt').value = contato.email;
            document.getElementById('obs-ctt').value = contato.observacao;
        })
    }
}

$(document).on('click', '#btn-salvar', function (e) {
    e.preventDefault();

    var formulario = new Formulario;
    formulario.salvar();
});

$(document).on('click', '#btn-excluir', function (e) {
    e.preventDefault();
    resultado = window.confirm('Deseja realmente excluir o contato?');
    if (resultado == true) {
        var idContato = document.getElementById('id-contato').value
        var status = document.getElementById('statusExcluido').value
        let idUsuario = document.getElementById('id-usuario').value
        let idDB = localStorage.getItem('id_usuario')
        if (idUsuario === idDB){
            let formulario = new Formulario;
            formulario.excluir(idContato, status)
        }else {
            exibirMensagemSucesso('Apenas o usuário que realizou o cadastro do contato tem permissão para excluí-lo.')
        }
   
    }
});




