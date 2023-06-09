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

    contato;

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

    getTelefones() {
        let telefone = [];
        $.each(document.getElementsByClassName('telefone'), function (indice, input) {
            telefone[indice] = input.value;
        });
        return telefone
    }

    getIdContato() {

        var idContato = '';

        if (document.getElementById('id-contato').value.length === 36) {
            idContato = document.getElementById('id-contato').value;
        } else {
            idContato = uuidv4();
        }

        return idContato;
    }

    hidratar() {
        this.contato = new Contato(
            document.getElementById('nome-ctt').value,
            document.getElementById('sexoMasculino').checked ? 'M' : 'F',
            this.getTelefones(),
            document.getElementById('email-ctt').value,
            document.getElementById('municipiosCadastro').value,
            document.getElementById('obs-ctt').value,
            this.getIdContato(),
            localStorage.getItem('id_usuario'),
            document.getElementById('statusExcluido').value = 'ativo'
        );
    };

    salvar() {
        this.hidratar();
        let filtrarContato = new contatoFilter;
        filtrarContato.filtrar(this.contato);
        let validarContato = new contatoValidacao;
        validarContato.validar(this.contato);

        if (document.getElementById('id-contato').value.length === 36) {
            this.atualizar(this.contato)
        } else {
            this.inserir(this.contato)
        }
    };

    excluir(idContato, status) {
        if (status !== 'ativo') {
            return;
        }

        getContato(idContato).then((contato) => {
            contato.status = 'excluido';
            let modelContato = new ContatoModel;
            modelContato.atualizar(contato)
                .then(() => { mensagemAtualizado('O contato será excluido apos a sincronização') })
                .catch((erro) => { console.log(erro) })
        })
    }

    preencherFormulario(idContato) {
        getContato(idContato).then((contato) => {
            document.getElementById('id-contato').value = contato.codigoContato;
            document.getElementById('statusExcluido').value = contato.status
            document.getElementById('id-usuario').value = contato.idUsuarioInsert
            document.getElementById('nome-ctt').value = contato.nome;

            if (contato.sexo === 'M') {
                document.getElementById('sexoMasculino').checked = true;
            } else if (contato.sexo === 'F') {
                document.getElementById('sexoFeminino').checked = true;
            }

            removerInputTelefone()
            for (var indice = 0; indice < contato.telefone.length; indice++) {
                if (indice > 0) {
                    var idTelefone = criarInputTelefone();
                }
                criarBotaoRemover(idTelefone);
                hidratarTelefone(indice, contato);
            }

            $("#municipiosCadastro").val(contato.municipio).trigger('change');
            document.getElementById('email-ctt').value = contato.email;
            document.getElementById('obs-ctt').value = contato.observacao;
        })
    }

    inserir(contato) {
        let modelContato = new ContatoModel;
        modelContato.adicionar(contato)
            .then((mensagem) => {
                exibirMensagemSucesso(mensagem);
                limparInput()
            })
    }

    atualizar(contato) {
        let modelContato = new ContatoModel;
        modelContato.atualizar(contato)
            .then((mensagem) => {
                mensagemAtualizado(mensagem);
            })
            .catch((erro) => {
                console.log(erro);
            })
    }
}


class contatoFilter {

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

    filtrar(contato) {
        this.filtrarNome(contato.nome);
        this.filtrarEmail(contato.email);
        this.filtrarObservacao(contato.observacao);
        console.log(this)
        contato.municipio = document.getElementById('municipiosCadastro').value;
        const THIS = this;

        contato.telefone.forEach(function (value, indice) {
            contato.telefone[indice] = THIS.filtrarTelefone(value);
        });

    };

}

class contatoValidacao {
    validarNomeCidadao(nome) {
        var nomeTrim = nome.trim();
        var nomeSemEspacoDuplicado = nomeTrim.replace(/( )+/g, ' ');

        try {
            if (nomeSemEspacoDuplicado.length < 4) {
                throw 'O nome deve conter pelo menos quatro caracteres.';
            }

            var arrNome = nomeSemEspacoDuplicado.split(' ');

            if (!arrNome[1]) {
                throw 'O nome deve conter mais de um termo.';
            }

            if (arrNome[0].length === 1 && arrNome[1].length === 1) {
                throw 'O dois primeiros termos n�o podem conter apenas um (1) caracter.';
            }

            jQuery.each(arrNome, function (i, value) {
                if (value.length === 1 && (value !== 'E' && value !== 'Y')) {
                    throw 'O nome n�o pode conter palavra com um �nico termo que n�o seja "E" ou "Y".';
                }
            });

            return true;
        }
        catch (err) {
            return false;
        }
    }

    validarSexo(sexo) {
        if (sexo !== 'M' && sexo !== 'F') {
            return false
        }
    }

    validarTelefone(telefone) {
        if (telefone.length < 10 && telefone.length > 11) {
            return false;
        }

        for (var n = 0; n < 10; n++) {
            if (telefone == new Array(11).join(n) || telefone == new Array(12).join(n)) {
                return false;
            }
        }

        var codigosDDD = [11, 12, 13, 14, 15, 16, 17, 18, 19,
            21, 22, 24, 27, 28, 31, 32, 33, 34,
            35, 37, 38, 41, 42, 43, 44, 45, 46,
            47, 48, 49, 51, 53, 54, 55, 61, 62,
            64, 63, 65, 66, 67, 68, 69, 71, 73,
            74, 75, 77, 79, 81, 82, 83, 84, 85,
            86, 87, 88, 89, 91, 92, 93, 94, 95,
            96, 97, 98, 99];

        if (codigosDDD.indexOf(parseInt(telefone.substring(0, 2))) == -1) {
            return false;
        }

        return true;
    }

    validarEmail(email) {
        var exclude = /[^@\-\.\w]|^[_@\.\-]|[@\.]{2}|(@)[^@]*\1/;
        var check = /@[\w\-]+\./;
        var checkend = /\.[a-zA-Z]{2,3}$/;
        if (((email.search(exclude) != -1) || (email.search(check)) == -1) || (email.search(checkend) == -1)) {
            return false;
        }
        else {
            return true;
        }
    }

    validar(contato) {
        try {

            if (this.validarNomeCidadao(contato.nome) === false) {
                throw 'O nome do contato é inválido';
            }

            if (this.validarSexo(contato.sexo) === false) {
                throw 'O sexo é invalido'
            }

            const THIS = this;

            contato.telefone.forEach(function (value, indice) {
                if (THIS.validarTelefone(value) === false) {
                    throw 'O telefone ' + value + ' é invalido';
                };
            });

            if (this.validarEmail(contato.email) === false) {
                throw 'O endereço de email é inválido';
            }

            return true;

        } catch (mensagem) {
            console.log(mensagem)
            exibirMensagemDeErro(mensagem);
            return false;
        }
    };
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
        if (idUsuario === idDB) {
            let formulario = new Formulario;
            formulario.excluir(idContato, status)
        } else {
            exibirMensagemSucesso('Apenas o usuário que realizou o cadastro do contato tem permissão para excluí-lo.')
        }

    }
});

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

function criarInputTelefone() {
    let idTelefone = (new String(Math.random())).split('.')[1];
    let inputTelefone = document.createElement('input');
    inputTelefone.setAttribute('class', 'campo-nome mdl-textfield__input telefone limpar');
    inputTelefone.setAttribute('id', idTelefone)
    inputTelefone.classList.add('input-telefone-novo');
    document.getElementById('telefone-ctt').appendChild(inputTelefone)
    return idTelefone;
}

function criarBotaoRemover(idTelefone) {
    let btnremover = document.createElement('button');
    btnremover.setAttribute('class', 'mdl-button mdl-button--fab mdl-button--mini-fab btn-remover remove');
    btnremover.innerHTML = '<i class="material-icons">remove</i>'
    btnremover.setAttribute('id-telefone', idTelefone);
    document.getElementById('telefone-ctt').appendChild(btnremover);
    $('.telefone').mask('(99) 99999-999?9');
}

function removerInputTelefone() {
    if (document.getElementsByClassName('input-telefone-novo').length <= 0) {
        return
    }

    for (var i = 0; i < document.getElementsByClassName('input-telefone-novo').length; i++) {
        document.getElementsByClassName('input-telefone-novo')[i].remove()
        document.getElementsByClassName('btn-remover')[i].remove();
    }
}
