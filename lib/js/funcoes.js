var Calendario = {
    return_fnc: {
        text: '',
        obj: ''
    },
    is_date: function (data) {

        var re = /^([0-9]{2})+\/+([0-9]{2})+\/+([0-9]{4})$/;

        if (typeof (data) === 'string') {
            var data = data;
        }
        else if (typeof (data) === 'object') {
            if (data.value === undefined) { //-- >> objeto jquery
                var data = jQuery(data).val();
            }
            else {   //-- >> objeto ecmascript
                var data = data.value;
            }
        }

        var day = parseInt(data.substring(0, 2), 10);
        var month = parseInt(data.substring(3, 5), 10);
        var year = parseInt(data.substring(6, 10), 10);

        if (re.test(data)) {

            if (day > 31 || day < 01) {

                this.return_fnc.text = 'Dia inv�lido';
                return false;
            }

            if (month > 12) {

                this.return_fnc.text = 'M�s inv�lido';
                return false;
            }

            var hoje = new Date();
            var anoAtual = hoje.getFullYear();

            if (year <= 1890 || year > anoAtual) {

                this.return_fnc.text = 'Ano inv�lido';
                return false;
            }
        }
        else {

            this.return_fnc.text = 'Data inv�lida';
            return false;
        }

        return true;
    },
    intervalo_valido: function (ini, fim, retorno_intervalo) {

        var str_ini = (typeof (ini) === 'object' ? ini.value.replace(/\//g, '') : ini.replace(/\//g, ''));
        var str_fim = (typeof (fim) === 'object' ? fim.value.replace(/\//g, '') : fim.replace(/\//g, ''));

        var data_ini = new Date(str_ini.substring(4, 8), parseInt(str_ini.substring(2, 4), 10) - 1, str_ini.substring(0, 2));
        var data_fim = new Date(str_fim.substring(4, 8), parseInt(str_fim.substring(2, 4), 10) - 1, str_fim.substring(0, 2));

        if (data_ini.getTime() > data_fim.getTime()) {

            this.return_fnc.text = 'Intervalo de data inv�lido!';

            return false;
        }
        else {

            //-- limite_intervalo
            if (retorno_intervalo) {

                var tempo_intervalo = (data_fim.getTime() - data_ini.getTime());

                var dias = (tempo_intervalo / (1000 * 60 * 60 * 24));

                this.return_fnc.text = parseInt(dias, 10);
            }
        }

        return true;
    }
};

function calculaIdade(data) {
    Todays = new Date();
    dataHoje = Todays.getDate() + "/" + (Todays.getMonth() + 1) + "/" + Todays.getFullYear();

    x = data.split("/");
    h = dataHoje.split("/");
    if (x[0] > 31 || x[1] > 12 || x[2] > h[2]) {
        return 0;
    }

    anosProvisorio = h[2] - x[2];

    if (h[1] < x[1]) {
        anosProvisorio -= 1;
    }
    else if (h[1] == x[1]) {
        if (h[0] < x[0]) {
            anosProvisorio -= 1;
        }
    }

    return anosProvisorio;
}

function removerAcentos(s) {
    //-- referencia
    //-- https://gist.github.com/alisterlf/3490957 -
    //-- http://stackoverflow.com/questions/286921/efficiently-replace-all-accented-characters-in-a-string
    if (!re)
        var re = /[�������������������������������������������������������???��??]/g;
    var dicionario = {
        '�': 'A', '�': 'A', '�': 'A', '�': 'A', '�': 'A', '�': 'A', '�': 'a', '�': 'a', '�': 'a', '�': 'a', '�': 'a', '�': 'a',
        '�': 'O', '�': 'O', '�': 'O', '�': 'O', '�': 'O', '�': 'O', '�': 'O', '�': 'o', '�': 'o', '�': 'o', '�': 'o', '�': 'o', '�': 'o',
        '�': 'E', '�': 'E', '�': 'E', '�': 'E', '�': 'e', '�': 'e', '�': 'e', '�': 'e', '�': 'e', '�': 'C', '�': 'c', '�': 'D',
        '�': 'I', '�': 'I', '�': 'I', '�': 'I', '�': 'i', '�': 'i', '�': 'i', '�': 'i',
        '�': 'U', '�': 'U', '�': 'U', '�': 'U', '�': 'u', '�': 'u', '�': 'u', '�': 'u',
        '�': 'N', '�': 'n', '?': 'S', '?': 's', '?': 'Y', '�': 'y', '�': 'y', '?': 'Z', '?': 'z'
    };
    return (s.replace(re, function (match) {
        return dicionario[match];
    }));
}

/**
 * Gera a GUID string.
 * @returns {String} O GUID gerado.
 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 * @author Slavik Meltser (slavik@meltser.info).
 * @link http://slavik.meltser.info/?p=142
 * @ref http://slavik.meltser.info/the-efficient-way-to-create-guid-uuid-in-javascript-with-explanation/
 */

function uniqueId() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

// Retornando textarea com encoding correto
function getValueTextArea(id) {
    var obj = {}, textArea = jQuery('#iframe_' + id).contents().find('#editor_' + id);
    obj.origin = textArea.html();
    // Retorna o conteudo do attributo TEXT
    obj.text = encodeURI(jQuery('<textarea />').html(textArea.html()).text().trim());
    return obj;
}

/**
 * Higieniza uma string conforme a codifica��o ISO/IEC 8859-1 (Latin1)
 *
 * @param string String qualquer
 *
 * @return string Latin1
 */

function sanitizeLatin1(str) {
    /**
     * Aceita Latin1 https://pt.wikipedia.org/wiki/ISO/IEC_8859-1
     * exceto o intervalo 00A1 a 00BF
     */
    var tabelaLatin1 = /[^\u0020-\u00FF]|[\u00A1-\u00BF]/g;

    return str.replace(tabelaLatin1, '');
};

/**
 * Fun��o que retorna o m�s por extenso.
 *
 * @param {strint/int} $mes N�mero do m�s.
 *
 * @author Murillo Lima Costa
 */
function nomeMes(mes) {
    mes = parseInt(mes) - 1;

    // Valida��o do m�s
    if (mes < 0 && mes > 11) {
        return "";
    }

    var arrMes = [
        "Janeiro",
        "Fevereiro",
        "Mar�o",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    return arrMes[mes];
}

/**
 * Valida o formato da data e retorna true se o formato for YYYY-MM-DD e false
 * se for diferente disso.
 * S
 * @author Joabe
 * @param string data Data no formato YYYY-MM-DD
 * @return boolean
 */
function validarDataIso(data) {
    var re = /^[12][0-9]{3}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
    return re.test(data);
}

/**
 * Recebe uma data de nascimento no formato ISO (descrito abaixo) e retorna a
 * idade escrita por extenso. Por exemplo, ao informar uma data xxxx-xx-xx, a
 * fun��o retornar� "57 anos, 11 meses e 21 dias".
 *
 * @author Joabe (essa fun��o foi copiada da internet, apenas fiz pequenos ajustes)
 * @param string dateString Data no formato YYYY-MM-DD
 * @return string
 */
function idadePorExtenso(dateString) {
    if (!validarDataIso(dateString)) {
        return false;
    }

    var arrData = dateString.split('-');
    dateString = arrData[1] + '-' + arrData[2] + '-' + arrData[0];

    var now = new Date();
    var today = new Date(now.getYear(), now.getMonth(), now.getDate());

    var yearNow = now.getYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();

    var dob = new Date(dateString.substring(6, 10), dateString.substring(0, 2) - 1, dateString.substring(3, 5));

    var yearDob = dob.getYear();
    var monthDob = dob.getMonth();
    var dateDob = dob.getDate();
    var age = {};
    var ageString = "";
    var yearString = "";
    var monthString = "";
    var dayString = "";

    yearAge = yearNow - yearDob;

    if (monthNow >= monthDob) {
        var monthAge = monthNow - monthDob;
    } else {
        yearAge--;
        var monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob) {
        var dateAge = dateNow - dateDob;
    } else {
        monthAge--;
        var dateAge = 31 + dateNow - dateDob;

        if (monthAge < 0) {
            monthAge = 11;
            yearAge--;
        }
    }

    age = {
        years: yearAge,
        months: monthAge,
        days: dateAge
    };

    yearString = (age.years > 1) ? " anos" : " ano";
    monthString = (age.months > 1) ? " meses" : " m�s";
    dayString = (age.days > 1) ? " dias" : " dia";

    if ((age.years > 0) && (age.months > 0) && (age.days > 0)) {
        ageString = age.years + yearString + ", " + age.months + monthString + " e " + age.days + dayString;
    } else if ((age.years == 0) && (age.months == 0) && (age.days > 0)) {
        ageString = age.days + dayString;
    } else if ((age.years > 0) && (age.months == 0) && (age.days == 0)) {
        ageString = age.years + yearString; //" old. Happy Birthday!!"
    } else if ((age.years > 0) && (age.months > 0) && (age.days == 0)) {
        ageString = age.years + yearString + " e " + age.months + monthString;
    } else if ((age.years == 0) && (age.months > 0) && (age.days > 0)) {
        ageString = age.months + monthString + " e " + age.days + dayString;
    } else if ((age.years > 0) && (age.months == 0) && (age.days > 0)) {
        ageString = age.years + yearString + " e " + age.days + dayString;
    } else if ((age.years == 0) && (age.months > 0) && (age.days == 0)) {
        ageString = age.months + monthString;
    } else {
        ageString = "Opa! N�o foi poss�vel calcular a idade.";
    }

    return ageString;
}

/**
 * @author Joabe
 *
 * Esta classe foi constru�da para verificar se o hor�rio do servidor confere
 * com o hor�rio do cliente. Em caso de diverg�ncia, o sistema n�o poder� ser
 * acessado.
 */
var Horario = (function () {
    return {
        "conferir": function () {

            var clientTimestamp = Math.floor(new Date().getTime() / 1000);

            // A toler�ncia para diverg�ncia de hor�rio � de tr�s (3) minutos.
            if ((Math.abs(clientTimestamp - SERVER_TIMESTAMP)) > 900) {
                jQuery(".caixa_conteudo_central, .caixa_menu_principal").html('');
                jQuery("#ajuste-relogio").show();
            }
        }
    }
}());


/**
 * Fun��o que retorna a string formatada.
 *
 * @param {string} cpf
 *
 * @author Murillo Lima Costa <murillo@icsgo.com.br>
 */
function formataCPF(cpf) {
    //retira os caracteres indesejados...
    cpf = cpf.replace(/[^\d]/g, "");

    //realizar a formata��o...
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Fun��o que valida se uma string � do tipo sha1
 * 
 * @param string 
 * 
 * @return bool
 * 
 * @author Murillo Lima Costa <murillo@icsgo.com.br>
 */
function validSha1(string) {
    var regexp = /^[0-9a-f]{40}$/i;

    return regexp.test(string);
}


function validarRadioGroup(obj) {
    var length = obj.length;

    for (var i = 0; i < length; i++) {
        if (obj[i].checked == true) {
            return true;
        }
    }

    return false;
}

function getValorRadioGroup(obj) {
    var length = obj.length;

    for (var i = 0; i < length; i++) {
        if (obj[i].checked == true) {
            return obj[i].value;
        }
    }
}

function getValorCheckBoxes(nomeElemento) {
    var checkboxes = document.getElementsByName(nomeElemento),
        tamanho = checkboxes.length,
        arrElementos = new Array();

    for (var i = 0; i < tamanho; i++) {
        if (checkboxes[i].checked === true) {
            arrElementos[arrElementos.length] = checkboxes[i].value;
        }
    }

    return arrElementos;
}

/*
 * @param formatoDeSaida => "banco" ou "site"
 */
function formataData(data, formatoDeSaida) {
    if (data != null) {

        var strData = new String(data.replace(/[^\d]+/g, ''));

        if (strData.length === 8) {
            if (formatoDeSaida === "site") {
                var dia = strData.substr(6, 2);
                var mes = strData.substr(4, 2);
                var ano = strData.substr(0, 4);

                return dia + '/' + mes + '/' + ano;
            }
            else if (formatoDeSaida === "banco") {
                var dia = strData.substr(0, 2);
                var mes = strData.substr(2, 2);
                var ano = strData.substr(4, 4);

                return ano + '-' + mes + '-' + dia;
            }
        }
    }

    return false;
}

/*
 * @param formatoDeSaida => "banco" ou "site"
 */
function formataDataHora(data, formatoDeSaida) {
    var strData = new String(data.replace(/[^\d]+/g, ''));

    if (strData.length === 14) {
        if (formatoDeSaida === "site") {
            var dia = strData.substr(6, 2);
            var mes = strData.substr(4, 2);
            var ano = strData.substr(0, 4);
            var hora = strData.substr(8, 2);
            var min = strData.substr(10, 2);
            var sec = strData.substr(12, 2);

            return dia + '/' + mes + '/' + ano + " " + hora + ":" + min;
        }
        else if (formatoDeSaida === "banco") {
            var dia = strData.substr(0, 2);
            var mes = strData.substr(2, 2);
            var ano = strData.substr(4, 4);
            var hora = strData.substr(8, 2);
            var min = strData.substr(10, 2);
            var sec = strData.substr(12, 2);

            return ano + '-' + mes + '-' + dia + " " + hora + ":" + min + ":" + sec;
        }
    }

    return false;
}

function formatarCep(cep) {
    var cepFormat = "";

    if (cep.length === 8) {
        cepFormat = cep.substr(0, 5) + '-' + cep.substr(5, 8);
    }
    else if (cep.length === 9) {
        cepFormat = cep.substr(0, 5) + cep.substr(6, 9);
    }

    return cepFormat;
}

function soNumero(str) {
    return str.replace(/[^\d]+/g, '')
}

function isNumeric(str) {
    var er = /^[0-9]+$/;
    return (er.test(str));
}

//Verifica se um objeto � vazio.
function empty(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }

    return true;
}

function habilitarRadioGroup(obj) {
    var length = obj.length;

    for (var i = 0; i < length; i++) {
        obj[i].removeAttribute("disabled");
    }
}

function desabilitarRadioGroup(obj, manterChecked) {
    var length = obj.length;

    for (var i = 0; i < length; i++) {
        if (typeof (manterChecked) === 'undefined') {
            obj[i].checked = false;
        }

        obj[i].setAttribute("disabled", "true");
    }
}

function desmarcarRadioGroup(obj) {
    var length = obj.length;

    for (var i = 0; i < length; i++) {
        obj[i].checked = false;
    }
}

function setRadioGroup(nameObj, value) {
    var obj = document.getElementsByName(nameObj),
        length = obj.length;

    for (var i = 0; i < length; i++) {
        if (obj[i].value == value) {
            obj[i].checked = true;
            return obj[i];
        }
    }
}

function setCheckBox(nomeElemento, objValues) {
    if (!objValues || objValues.length < 1) { return false; }

    var checkboxes = document.getElementsByName(nomeElemento),
        qtdCheckbox = checkboxes.length;

    for (var i = 0; i < qtdCheckbox; i++) {
        for (var x = 0; x < objValues.length; x++) {
            if (checkboxes[i].value == objValues[x]) {
                checkboxes[i].checked = true;
            }
        }
    }
}

/*
 * Calcula a diferen�a de meses entre duas datas.
 * 
 * @param string dataAntiga Data de nascimento no formato DD/MM/AAAA
 * @param string dataRecente Data de nascimento no formato DD/MM/AAAA
 * @return int months N�mero de meses
 */
function diferencaMeses(dataAntiga, dataRecente) {
    dataAntiga = new Date(formataData(dataAntiga, 'banco'));
    dataRecente = new Date(formataData(dataRecente, 'banco'));

    var months;

    months = (dataRecente.getFullYear() - dataAntiga.getFullYear()) * 12;
    months -= dataAntiga.getMonth() + 1;
    months += dataRecente.getMonth() + 1;

    return (months <= 0) ? 0 : months;
}

//Retorna a data atual no formato DD/MM/YYYY.
function getData() {
    var objData = new Date();
    var dia = (objData.getDate() < 10) ? '0' + objData.getDate() : objData.getDate();
    var mes = objData.getMonth() + 1;

    if (mes < 10) {
        mes = '0' + mes;
    }

    var dataHoje = dia + '/' + mes + '/' + objData.getFullYear();

    return dataHoje;
}

/*
 * Divide uma string e retorna parte dela (j� concatenada).
 * 
 * @param str String a ser explodida.
 * @param limit Inteiro define a quantidade de palavras a serem retornadas.
 * @param delimiter Inteiro Delimitador
 * 
 * var str = explode_name('JOSE DA SILVA PEREIRA', 3);
 * alert (str); // JOSE DA SILVA
 */
function explode_name(str, limit, delimiter) {
    delimiter = (delimiter) ? delimiter : ' ';
    var strConcat = '';

    var arrName = str.split(delimiter);

    for (var x = 0; x < limit; x++) {
        if (arrName[x]) {
            strConcat += arrName[x] + ' ';
        }
    }

    return strConcat;
}

function array_diff(arr1) {
    //  discuss at: http://phpjs.org/functions/array_diff/
    // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Sanjoy Roy
    //  revised by: Brett Zamir (http://brett-zamir.me)
    //   example 1: array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld']);
    //   returns 1: {0:'Kevin'}

    var retArr = {},
        argl = arguments.length,
        k1 = '',
        i = 1,
        k = '',
        arr = {};

    arr1keys: for (k1 in arr1) {
        for (i = 1; i < argl; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1]) {
                    // If it reaches here, it was found in at least one array, so try next value
                    continue arr1keys;
                }
            }
            retArr[k1] = arr1[k1];
        }
    }

    return retArr;
}

// valida telefone 


/** 
 * verifica se a data2 e mais antiga que a data1.
 * 
 * @author Gabriel.
 * @param string data1 
 * @param string data2 
 * @returns boolean
 */
function dataMaior(data1, data2) {
    if (typeof data1 !== 'string' || typeof data2 !== 'string') {
        throw 'data1 e data2 tem que ser do tipo string.';
    }

    if (data1.length !== 10 || data2.length !== 10) {
        throw 'Data invalida.';
    }

    var arrData1 = data1.split('/');
    var arrData2 = data2.split('/');

    var objData1 = new Date(parseInt(arrData1[2]), (parseInt(arrData1[1]) - 1), parseInt(arrData1[0]));
    var objData2 = new Date(parseInt(arrData2[2]), (parseInt(arrData2[1]) - 1), parseInt(arrData2[0]));

    /**
     * getTime() retorna o valor em milissegundos entre as datas setadas e a 
     * data atual, Assim o calculo da dataMaior e o resultado da diferen�a em 
     * milissegundos entre a data1 e a data2.
     */
    if (objData1.getTime() > objData2.getTime()) {
        return true;
    }

    return false;
}

/*
 * @param date String Data no formato brasileiro 'dd/mm/yyyy'
 * 
 * Verifica se uma data � v�lida.
 */
function checkdate(date) {
    //  Esta fun��o recebeu uma pequena adapta��o para se adequar melhor ao 
    //  formato brasileiro de data e ao plugin utilizado nos campos de data.
    //  
    //  discuss at: http://phpjs.org/functions/checkdate/
    //  original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //  improved by: Pyerre
    //  improved by: Theriault
    //   example 1: checkdate(12, 31, 2000);
    //   returns 1: true
    //   example 2: checkdate(2, 29, 2001);
    //   returns 2: false
    //   example 3: checkdate(3, 31, 2008);
    //   returns 3: true
    //   example 4: checkdate(1, 390, 2000);
    //   returns 4: false

    var arrDate = date.split('/');

    var d = parseInt(arrDate[0]);
    var m = parseInt(arrDate[1]);
    var y = parseInt(arrDate[2]);

    return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
}

// Validar no banco email ja utilizado
function emailUtilizado() {
    var dialog = document.querySelector('dialog');
    dialog.showModal();

    document.querySelector('#mensagem-erro').textContent = ('Email ja utilizado, verifique por favor!');

    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
}

function exibirMensagemDeErro(mensagem) {
    var dialog = document.getElementById('dialog1');
    dialog.showModal();

    document.querySelector('#mensagem-erro').textContent = (mensagem);

    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });
}

function exibirMensagemSucesso(mensagem) {

    var dialog = document.getElementById('dialog');
    dialog.showModal();

    document.querySelector('#mensagem-erro2').textContent = (mensagem);

    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });

}

function validarCpf(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf == '') {
        return false;
    }

    // Elimina CPFs invalidos conhecidos    
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999") {
        return false;
    }

    // Valida 1o digito 
    add = 0;

    for (i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;

    // Valida 2o digito 
    add = 0;

    for (i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

function validarJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (Exception) {
        return false;
    }
}

/*
 * Calcular quantidade de dias entre duas datas
 * Ex.: calcularDiasEntreDatas(dia/mes/Ano, dia/mes/Ano)
 */
function calcularDiasEntreDatas(dataMenor, dataMaior) {
    try {
        if (!checkdate(dataMenor)) {
            throw 'A data menor � inv�lida.';
        }

        if (!checkdate(dataMaior)) {
            throw 'A data maior � inv�lida.';
        }

        var arrDataMenor = dataMenor.split("/"),
            arrDataMaior = dataMaior.split("/");

        var dataInicial = new Date(arrDataMenor[2], arrDataMenor[1], arrDataMenor[0]),
            dataFinal = new Date(arrDataMaior[2], arrDataMaior[1], arrDataMaior[0]);

        var dif = dataFinal.getTime() - dataInicial.getTime();
        dif /= 86400000;
        dif = parseInt(dif);

        return dif;
    } catch (err) {
        console.log(err);
        return;
    }
}

//------------------------------------------------------------------------------


function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function getNomeCidadeNew(ibge) {
    return new Promise((resolve, reject) => {
        resolve(municipios[ibge].nomeCidade)
    })
}

function formatarNumero(telefone) {
    var Telefoneformatado;
    var numero = telefone.toString()
    if (numero.length == 11) {
        var ddd = numero.slice(0, 2);
        var nonoDigito = numero.slice(2, 3);
        var numeroParteUm = numero.slice(3, 7);
        var numeroParteDois = numero.slice(7, 11);
        return Telefoneformatado = '(' + ddd + ') ' + nonoDigito + "-" + numeroParteUm + "-" + numeroParteDois;
    } else {
        var ddd = numero.slice(0, 2);
        var numeroParteUm = numero.slice(2, 6);
        var numeroParteDois = numero.slice(6, 10);
        Telefoneformatado = '(' + ddd + ') ' + numeroParteUm + "-" + numeroParteDois;
    }
}

function limparInput() {
    $(".limpar").val("");
    // document.getElementById('select2-municipiosCadastro-container').innerText = 'Selecione o municipio'
};

function hidratarTelefone(indice, contato) {
    document.getElementsByClassName('telefone')[indice].value = contato.telefone[indice]
    $('.telefone').mask('(99) 99999-999?9');
}

function mensagemAtualizado(mensagem) {
    var snackbarContainer = document.querySelector('#demo-toast-example');
    var data = { message: mensagem };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
};

function sincronizacaoSucesso(mensagem) {
    var snackbarContainer = document.querySelector('#msg-sincronizacao');
    var data = { message: mensagem };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
};


function getContatosAtivos() {
    var contatoAtivo = []
    var contatoModel = new ContatoModel;

    contatoModel.listar()
        .then((contatos) => {
            var geralContatos = contatos
            console.log(geralContatos)
            geralContatos.forEach(function (contato) {
                if (contato.statusExcluido === false) {
                    contatoAtivo.push(contato);
                }
            })
            return contatoAtivo;
        })

}


