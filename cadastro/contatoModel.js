var db;
var request = window.indexedDB.open("DBcontato", 1);

request.onerror = function(event) {
    console.log("Não foi possivel conectar na base de dados!");
};

request.onupgradeneeded = function (event) {
    db = event.target.result;
    var contatoObjectStore = db.createObjectStore("contato", { autoIncrement : true });
    contatoObjectStore.createIndex('email', 'email', {unique: true});
}

request.onsuccess = function(event) {
    db = event.target.result;
};

class ContatoModel {

    adicionar(contato) {

        if (this.validarObjetoContato(contato) === false) {
            console.log("O objeto contato é inválido.");
            return false;
        }

        let transaction = db.transaction(['contato'], 'readwrite');
        let objectStore = transaction.objectStore('contato');
        objectStore.add(contato);

        transaction.onerror = function(event) {
            
            console.log(event);
            console.log(event.explicitOriginalTarget.error.message);
            console.log(event.explicitOriginalTarget.error.name);
            console.log(event.explicitOriginalTarget.source.indexNames[0]);

            if (event.explicitOriginalTarget.source.indexNames[0] === 'email') {
                emailUtilizado()
            };
        };

    }
    
    remover(contato) {
        let transaction = db.transaction(["contato"], "readwrite");
        let objectStore = transaction.objectStore("contato");
        objectStore.delete(contato);

        transaction.onsuccess = function(event) {
            console.log('contato exluido')
        };

    }

    listar_old() {

        let transaction = db.transaction(['contato'], 'readonly');
        let objectStore = transaction.objectStore('contato');
        var arrayContatos = []

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor) { 
                arrayContatos.push(cursor.value)
                cursor.continue();
                // console.log(arrayContatos)
            } else {
                // console.log('erro');
                
            }
        };
        return arrayContatos
    }

    listar() {

        return new Promise ((resolve, reject) => {

            let transaction = db.transaction(['contato'], 'readonly');
            let objectStore = transaction.objectStore('contato');
            var arrayContatos = []

            objectStore.openCursor().onsuccess = function(event) {
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

        var atributos = ['nome', 'telefone', 'email', 'municipio', 'sexo'];

        return atributos.every((atributo) => {
            return contato.hasOwnProperty(atributo);
        });
    }

}

