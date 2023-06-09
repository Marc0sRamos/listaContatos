function getMunicipiosAjax() {
    var cidades = {}
    return new Promise((resolve, reject) => {
        jQuery.ajax({
            url: '/cadastros/ajax.php',
            data: { 'modulo': 'cidade', 'operacao': 'getCidade' },
            type: 'POST',
            async: true,
            dataType: 'json',

            success: function (objRetorno) {

                objRetorno.forEach(function (municipio, indice) {

                    cidades[municipio.ibge] = {
                        'municipio': municipio.municipio,
                        'uf': municipio.uf
                    }
                    if (indice === objRetorno.length - 1) {
                        resolve(cidades);
                    }
                })
            }, error: function (erro) {
                console.log(erro);
            }
        });
    })

}

var contatoDeleteDB = []
function deletarContatosDB() {
    return new Promise((resolve, reject) => {
        var contatoModel = new ContatoModel;
        contatoModel.listar()
            .then((contatos) => {
                contatos.forEach(function (contato, indice) {
                    if (contato.status === 'excluido') {
                        contatoDeleteDB.push(contato.codigoContato);
                    }
                })
            })
        setTimeout(() => {

            if (contatoDeleteDB.length <= 0) {
                return;
            }

            jQuery.ajax({
                url: '/cadastros/ajax.php',
                data: { 'modulo': 'contato', 'operacao': 'excluir', 'CodigosContato': contatoDeleteDB },
                type: 'POST',
                async: true,
                dataType: 'json',

                success: function (response) {
                    if (response.erro === false) {
                        resolve('Contato deletado com sucesso');
                        let contatomodel = new ContatoModel;
                        contatomodel.excluir(contatoDeleteDB);
                    } else {
                        console.log(response.mensagem);
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }, 1000);
    });
}

var contatosAtivosSinc
var errosSINC;
function salvarContatosDB() {
    console.log('iniciou salvarcontatosDB');
    return new Promise((resolve, reject) => {
        var contatoModel = new ContatoModel;
        contatoModel.listar()
            .then((contatos) => {
                function getMes(data) {
                    var mes = data.getMonth() + 1;
                    return (mes + '').padStart(2, '0')
                }
                function getHora(data) {
                    var hora = data.getHours()
                    return (hora + '').padStart(2, '0')
                }
                var contatoModel = new ContatoModel
                contatoModel.getContatosAtivos()
                    .then((contatosAtt) => {
                        contatosAtivosSinc = contatosAtt
                        contatosAtivosSinc.forEach(function (contato, indice) {
                            var data = new Date(contato.dataInsert)
                            var dataInsert = ''
                                + data.getFullYear() + '-'
                                + getMes(data) + '-'
                                + data.getDate() + ' '
                                + getHora(data) + ':'
                                + data.getMinutes() + ':'
                                + data.getSeconds()
                            contato.dataInsert = dataInsert;
                            contato.id_usuario_ultima_sincronizacao = id_usuario.codigo
                        });
                        // console.log(contatosAtivosSinc)
                        contatosAtivosSinc = JSON.stringify(contatosAtivosSinc);
                    })
            })
        setTimeout(() => {

            jQuery.ajax({
                url: '/cadastros/ajax.php',
                data: { 'modulo': 'Contato', 'operacao': 'salvar', 'contatos': contatosAtivosSinc },
                type: 'POST',
                async: true,
                dataType: 'json',


                success: function (erosSincronizacao) {
                    console.log(erosSincronizacao.mensagem)
                    sincErros = erosSincronizacao.dados;
                    if (erosSincronizacao.erro === false) {
                        sincronizacaoSucesso('Contatos salvos com sucesso')
                        carregarInconsistencias(false);
                    } else {
                        carregarInconsistencias(true);
                        console.log('erros')
                    }
                    // getErrosDB(sincErros);
                    // resolve;
                }
            })

        }, 1000);

    })
}

var contatosAtivosDB = []
function getContatosDB() {
    var contatosDB
    return new Promise((resolve, reject) => {
        jQuery.ajax({
            url: '/cadastros/ajax.php',
            data: { 'modulo': 'Contato', 'operacao': 'getcontatoDB', 'dados': contatosDB },
            type: 'POST',
            async: true,
            dataType: 'json',

            success: function (response) {
                if (response.erro != 'abc') {
                    contatosAtivosDB = response.dados
                    var contatoModel = new ContatoModel
                    contatoModel.insertcontatosDB(contatosAtivosDB)
                } else {
                    console.log(response)
                    //   getErrosLogin(response)
                }
            },
        });
    })
}

function getErrosDB(sincErros) {
    var errosSincronizacao = sincErros;
    console.log(sincErros)
    document.getElementById('container-erros').innerHTML = ''
    console.log(errosSincronizacao);
    errosSincronizacao.forEach(function (erro, indice) {

        var p = document.createElement('p');
        p.setAttribute('class', 'frases-erros');
        p.innerHTML = erro;

        var i = document.createElement('i');
        i.setAttribute('class', 'material-icons');
        i.setAttribute('id', 'icone-erro')
        i.innerHTML = 'error';
        p.appendChild(i);
        document.getElementById('container-erros').appendChild(p)

    })
}