<?php

class ContatoValidacao
{
    private $mensagensErro = [];

    function validarNome(string $nomeContato): bool
    {

        try {
            

            $arrNome = explode(' ', $nomeContato);

            // Regra Nº 1
            if (strlen($nomeContato) < 3) {
                throw new Exception('O nome deve conter pelo menos três caracteres.');
            }

            // Regra Nº 2
            if (!isset($arrNome[1])) {
                throw new Exception('O nome deve conter mais de um termo.');
            }

            /**
             * Regra Nº 5:
             * 
             * O NOME pode pode conter: letras do alfabeto romano (incluindo K, W, Y) e
             * acentos gráficos (agudo, circunflexo, til e trema) e o caractere apóstrofo '
             * sendo vedada a utilização de outros caracteres especiais;
             * 
             * O espaço \s foi incluído na regex para que a busca seja na string completa
             * em vez de ser apenas por palavras
             * 
             * @link http://esusab.github.io/integracao/ledi/regras/validar_nome.html Validação de nome PIX/PDQ
             *  'NULL';
             */
            $nome = mb_strtoupper(utf8_decode($nomeContato), 'ISO-8859-1');
            preg_match_all('/[^A-ZÁÉÍÓÚÂÊÎÔÛÃÕÑÄËÏÖÜKWYÝÇ\s\']+/i', $nome, $matches, PREG_SET_ORDER, 0);
            if (!empty($matches[0])) {
                foreach ($matches[0] as $key => $char) {
                    $char = trim($char);
                    if (!empty($char)) {
                        throw new Exception('Não permitido: ' . $char);
                    }
                }
            }

            // Regra Nº 6
            if (strlen($arrNome[0]) === 1 && strlen($arrNome[1]) === 1) {
                throw new Exception('O dois primeiros termos não podem conter apenas um (1) caracter.');
            }

            foreach ($arrNome as $termo) {
                if (strlen($termo) === 1 && ($termo !== 'E' && $termo !== 'Y')) {
                    throw new Exception('O nome não pode conter palavra com um único termo que não seja "E" ou "Y".');
                }
            }

            return true;
        } catch (Exception $ex) {
            return false;
        }
    }

    function validarSexo(string $sexoContato): bool
    {
        if ($sexoContato !== 'M' && $sexoContato !== 'F') {
            return false;
        } else {
            return true;
        }
    }

    function validarEmail(string $emailContato): bool
    {
        if (filter_var($emailContato, FILTER_VALIDATE_EMAIL)) {
            return true;
        } else {
            return false;
        }
    }

    function validarId($idContato): bool
    {
        if ($idContato > 0 && $idContato <  3299768) {
            return true;
        } else {
            return false;
        }
    }

    function validarData(string $data): bool
    {
        $dataExplode = (explode(" ", $data));
        $diaMesAno =  $dataExplode[0];
        $diaMesAno = (explode("-", $diaMesAno));

        if (checkdate($diaMesAno[1], $diaMesAno[2], $diaMesAno[0]) === false) {
            return false;
        } else {
            return true;
        }
    }

    function getErro(){
        return $this->mensagensErro;
    }

    function validarDados(stdClass $contato)
    {

        try {

            if ($this->validarEmail($contato->email) === false) {
                throw new Exception('O email do contato "' . $contato->nome . '" é invalido!');
            }

            if ($this->validarNome($contato->nome) === false) {
                throw new Exception('Nome do contato "' . $contato->nome . '" é invalido!');
            }

            if ($this->validarSexo($contato->sexo) === false) {
                throw new Exception('Sexo do contato "' . $contato->nome . '" é invalido!');
            }

            if ($this->validarId($contato->idUsuarioInsert) === false) {
                throw new Exception('O ID do usuario que realizou o insert do contato "' . $contato->nome. '" é invalido');
            }

            if ($this->validarId($contato->id_usuario_ultima_sincronizacao) === false) {
                throw new Exception('O ID do usuario que realizou a ultima sincronização é invalido');
            }

            if ($this->validarData($contato->dataInsert) === false) {
                throw new Exception('Data de insert do contato "' . $contato->nome . '" é invalida!');
            }

            return true;
            
        } catch (Exception $e) {
            $this->mensagensErro[] = $e->getMessage() . "\n";
            return false;
        }
    }

}
