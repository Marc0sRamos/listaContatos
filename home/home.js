$(document).ready(function () {
    $(document).on('click', '.liHome', function() {
        let idContato = $(this).attr('id-contato');
        carregarPagina({"rota": "cadastro", "callback": "preencherFormulario", "id": idContato})
    })
});

let arrCores = ['#008000', '#0000FF', '#F4A460', '#4B0082', '#FF4500', '#4682B4', '#48D1CC', '#8B008B', '#FF4500', '#FFD700', '#B22222'];

class Home {

    povoarGrid(contatos) {
        document.getElementById('listaContatos').innerHTML = ''
        return new Promise((resolve, reject) => {

            contatos.forEach(function (contato, indice) {
                var li = document.createElement('li');
                li.setAttribute('class', 'liHome');
                li.setAttribute('id-contato', contato.codigoContato);

                var p1 = document.createElement('p');
                p1.setAttribute('class', 'inicial-nome');
                p1.innerHTML = contato.nome.substring(0, 1);
                let cor ='#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);;
                p1.style.backgroundColor = cor;

                var p2 = document.createElement('p');
                p2.setAttribute('class', 'mnc-ctt-nome');
                p2.innerHTML = contato.nome;

                var p3 = document.createElement('p');
                p3.setAttribute('class', 'mnc-ctt');
                p3.innerHTML = municipios[contato.municipio].nomeCidade;

                var p4 = document.createElement('p');
                p4.setAttribute('class', 'mnc-telefone');

                var numero = contato.telefone[0].toString()                      

                if (numero.length == 11) {
                    var ddd = numero.slice(0,2);
                    var nonoDigito = numero.slice(2,3);
                    var numeroParteUm = numero.slice(3,7);
                    var numeroParteDois = numero.slice(7,11);
                   p4.innerHTML = '(' + ddd + ') ' + nonoDigito + "-" + numeroParteUm + "-" + numeroParteDois;
            
                } else {
                    var ddd = numero.slice(0,2);
                    var numeroParteUm = numero.slice(2,6);
                    var numeroParteDois = numero.slice(6,10);
                    p4.innerHTML = '(' + ddd + ') ' + numeroParteUm + "-" + numeroParteDois;
                }
                         
                li.appendChild(p1);
                li.appendChild(p2);
                li.appendChild(p3);
                li.appendChild(p4);
                document.getElementById('listaContatos').appendChild(li)
                resolve();
            });
        });
    }

    listarContatos() {
        var contatoModel = new ContatoModel;

        contatoModel.listar()
            .then((contatos) => { return this.povoarGrid(contatos); })
            .then(() => { console.log('grid carregada com sucesso.') });
    }  
}

