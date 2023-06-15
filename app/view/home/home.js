$(document).ready(function () {
    $(document).on('click', '.liHome', function () {
        let idContato = $(this).attr('id-contato');
        carregarPagina({ "rota": "cadastro", "callback": "preencherFormulario", "id": idContato })
    })
});

class Elemento {
    classe = '';
    element;

    setClasse(classe) {
        this.classe = classe;
        return this;
    }

    createElement(elemento) {
        this.element = document.createElement(elemento);
        this.element.setAttribute('class', this.classe);
        return this;
    }

    setAttribute(atributo, valor) {
        this.element.setAttribute(atributo, valor);
        return this;
    }

    setInnerHTML(texto) {
        this.element.innerHTML = texto;
        return this;
    }

    appendChild(elementoFilho) {
        this.element.appendChild(elementoFilho);
        return this;
    }
}

class Paragrafo extends Elemento {
    criarP() {
        this.createElement('p');
        return this;
    }
}

class Li extends Elemento {
    criarLi(idContato) {
        this.createElement('li');
        this.element.setAttribute('id-contato', idContato);
        return this;
    }
}

class Div extends Elemento {
    criarDiv() {
        this.createElement('div');
        return this;
    }
}

class Home {
    povoarGrid(contatos) {
        return new Promise((resolve) => {
            let listaContatos = document.getElementById('listaContatos');
            listaContatos.innerHTML = '';

            contatos.forEach((contato) => {
                this.montarGrid(contato)
            });

            console.log('grid carregada com sucesso.');
            resolve();
        });
    }

    listarContatos() {
        const contatoModel = new ContatoModel();
        contatoModel.listar()
            .then((contatos) => {
                this.povoarGrid(contatos);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    montarGrid(contato) {
        let div = new Div().setClasse('container-li').criarDiv();

        let item = new Li()
            .setClasse('liHome')
            .criarLi(contato.codigoContato);

        let p1 = new Paragrafo()
            .setClasse('inicial-nome')
            .criarP()
            .setInnerHTML(contato.nome.substring(0, 1));

        item.appendChild(p1.element);

        let p2 = new Paragrafo()
            .setClasse('mnc-ctt-nome')
            .criarP()
            .setInnerHTML(contato.nome);

        item.appendChild(p2.element);

        let p3 = new Paragrafo()
            .setClasse('mnc-ctt')
            .criarP()
            .setInnerHTML(cidadesBanco[contato.municipio].municipio);

        item.appendChild(p3.element);

        let telefone = verificarDigitosTelefone(contato.telefone[0].toString());
        let p4 = new Paragrafo()
            .setClasse('mnc-telefone')
            .criarP()
            .setInnerHTML(telefone);

        item.appendChild(p4.element);

        if (contato.status === 'excluido') {
            li.setAttribute('class', 'li-block')
            p2.setAttribute('class', 'nome-excluido mnc-ctt-nome')
            p3.setAttribute('class', 'nome-excluido mnc-ctt')
            p4.setAttribute('class', 'nome-excluido mnc-telefone');
        }

        div.appendChild(item.element);

        listaContatos.appendChild(div.element);
    }
}

function carregarPaginaHome() {
    if (typeof db !== 'object') {
        setTimeout("carregarPaginaHome()", 50);
        return;
    }
    carregarPagina({
        'rota': 'home',
        'callback': 'listarContatos'
    });
}

function verificarDigitosTelefone(numero) {
    var digitosTelefone

    if (numero.length == 11) {
        var ddd = numero.slice(0, 2);
        var nonoDigito = numero.slice(2, 3);
        var numeroParteUm = numero.slice(3, 7);
        var numeroParteDois = numero.slice(7, 11);
        digitosTelefone = '(' + ddd + ') ' + nonoDigito + "-" + numeroParteUm + "-" + numeroParteDois;
    } else {
        var ddd = numero.slice(0, 2);
        var numeroParteUm = numero.slice(2, 6);
        var numeroParteDois = numero.slice(6, 10);
        digitosTelefone = '(' + ddd + ') ' + numeroParteUm + "-" + numeroParteDois;
    }

    return digitosTelefone
}

