var db;
var request = window.indexedDB.open("DBcontato", 2);

request.onerror = function (event) {
    console.log("Não foi possivel conectar na base de dados!");
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    var contatoObjectStore = db.createObjectStore("contato", { keyPath: "codigoContato" });
    contatoObjectStore.createIndex('email', 'email', { unique: true });
    contatoObjectStore.createIndex('codigoContato', 'codigoContato', { unique: true });
    contatoObjectStore.createIndex('status', 'status', { unique: false });
}

request.onsuccess = function (event) {
    db = event.target.result;
};

class ContatoModel {

    adicionar(contato) {
        return new Promise((resolve, reject) => {
            if (this.validarObjetoContato(contato) === false) {
                console.log("O objeto contato é inválido.");
                return false;
            }

            let transaction = db.transaction(['contato'], 'readwrite')
                .objectStore('contato')
                .add(contato);

            if (transaction.onerror) {
                var erro = transaction.onerror
                console.log(erro);
                console.log(erro.explicitOriginalTarget.error.message);
                console.log(erro.explicitOriginalTarget.error.name);
                console.log(erro.explicitOriginalTarget.source.indexNames[0]);
                if (erro.explicitOriginalTarget.source.indexNames[0] === 'email') {
                    emailUtilizado()
                };
            }
            transaction.onsuccess = function (event) {
                resolve('Contato salvo com sucesso!')
            };
        })
    }

    excluir() {
        var contatoModel = new ContatoModel
        var contatoModel = new ContatoModel;

        contatoModel.listar()
            .then((contatos) => {
                contatos.forEach(function (contato) {

                    if (contato.status === 'excluido') {
                        let transaction = db.transaction(['contato'], 'readwrite')
                            .objectStore('contato')
                            .delete(contato.codigoContato);

                        transaction.onsuccess = () => {
                            console.log('Contato excluido, com sucesso!');
                            carregarPagina({ "rota": "home", "callback": "listarContatos" });
                        }

                        request.onerror = (err) => {
                            console.log(err)
                        }
                    }

                })
            })
    }

    getContatosAtivos() {
        return new Promise((resolve, reject) => {
            let contatosAtivos = [];
            let objectStore = db.transaction(['contato'], 'readonly').objectStore('contato');
            let status = objectStore.index('status');
            let cursorRequest = status.openCursor(IDBKeyRange.only('ativo'));
            cursorRequest.onsuccess = function (event) {
                let cursor = event.target.result;
                if (cursor) {
                    contatosAtivos.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(contatosAtivos);
                }
            };
            cursorRequest.onerror = function (event) {
                reject('Não foi possível obter os contatos ativos.');
            };
        });
    }

    listar() {
        return new Promise((resolve, reject) => {

            let transaction = db.transaction(['contato'], 'readonly');
            let objectStore = transaction.objectStore('contato');
            var arrayContatos = []

            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    arrayContatos.push(cursor.value)
                    cursor.continue();
                } else {
                    resolve(arrayContatos);
                }
            };
        });
    }

    validarObjetoContato(contato) {
        if (typeof contato !== 'object') {
            return false;
        }

        if (contato.nome === '') {
            console.log('nome invalido')
            return false
        }

        if (contato.sexo != 'F' && contato.sexo != 'M') {
            console.log('sexo invalido')
            return false
        }


        var atributos = ['nome', 'telefone', 'email', 'municipio', 'sexo'];

        return atributos.every((atributo) => {
            return contato.hasOwnProperty(atributo);
        });
    }

    atualizar(contato) {
        let erroInfo = { 'error': false, 'message': '' }
        return new Promise((resolve, reject) => {

            var transaction = db.transaction(['contato'], 'readwrite');
            let objectStore = transaction.objectStore('contato');
            var request = objectStore.get(contato.codigoContato);

            request.onerror = function (event) {
                reject()
            };

            request.onsuccess = function (event) {
                var contatoBanco = request.result;

                contatoBanco.nome = contato.nome;
                contatoBanco.sexo = contato.sexo;
                contatoBanco.telefone = contato.telefone;
                contatoBanco.email = contato.email;
                contatoBanco.municipio = contato.municipio;
                contatoBanco.observacao = contato.observacao;
                contatoBanco.status = contato.status

                var requestUpdate = objectStore.put(contatoBanco);

                requestUpdate.onerror = function (event) {
                    reject()
                };

                requestUpdate.onsuccess = function (event) {
                    resolve('Contato atualizado com sucesso!')

                };
            }
        })
    }

    insertcontatosDB(contatos) {
        contatos.forEach(function (contato) {

            validarObservacao(contato);

            var contatoDB = new Contato(contato.nome, contato.sexo, contato.telefone, contato.email, contato.municipio, contato.observacao, contato.id_contato, contato.id_usuario_insert, contato.data_insert, contato.status)

            let modelContato = new ContatoModel;
            modelContato.adicionar(contatoDB);
        })
    }

}

function getContato(codigo) {

    return new Promise((resolve, reject) => {

        let objectStore = db.transaction(['contato'], 'readonly')
            .objectStore('contato');

        let index = objectStore.index('codigoContato');
        let keyRangeValue = IDBKeyRange.only(codigo);
        let request = index.get(keyRangeValue);

        request.onsuccess = function () {
            if (request.result) {
                resolve(request.result)
            }
            else {
                console.log('index não encontrado');
            }
        }

    })
}

function validarObservacao(contato) {
    if (typeof(contato.observacao) !== String || contato.observacao.length <= 0) {
        contato.observacao = ''
    }
}



