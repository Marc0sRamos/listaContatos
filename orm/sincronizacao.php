<?php



class Contato
{

    function filtrar_nome($contato)
    {
        return htmlspecialchars(trim($contato->nome));
    }

    function filtrar_email($contato)
    {
        return htmlspecialchars(trim($contato->email));
    }

    function filtrar_obs($contato)
    {
        return htmlspecialchars(trim($contato->observacao));
    }

    function validar_nome($nomeCidadao)
    {
        if (empty($nomeCidadao)) {
            return;
        }

        try {

            $arrNome = explode(' ', $nomeCidadao);

            // Regra Nº 1
            if (strlen($nomeCidadao) < 3) {
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
             * 
             * @author Carlos Augusto <carlos@icsgo.com.br>
             * 
             */
            $nome = mb_strtoupper(utf8_decode($nomeCidadao), 'ISO-8859-1');
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

    function validar_sexo($sexoCidadao)
    {
        if ($sexoCidadao !== 'M' && $sexoCidadao !== 'F') {
            return false;
        }
    }


    private $pdo;

    function __construct($pdo)
    {
        $this->pdo = include './conection.php';
    }

    public function insertContato(array $contatos)
    {
    
        try {
            foreach ($contatos as $contato) {

                $contato->email = $this->filtrar_email($contato);
                $contato->nome = $this->filtrar_nome($contato);
                $contato->observacao = $this->filtrar_obs($contatos);
                // VALIDAR
                // $contato->nome = $this->validar_nome($contato->nome);

                $observacao = $contato->observacao;
                if ($observacao == '') {
                    $observacao = "NULL";
                };


                $sql = "INSERT INTO contato (id_contato,email,nome,observacao,sexo,id_usuario_insert,id_usuario_ultima_sincronizacao, data_ultima_sincronizacao, data_insert) VALUES ('$contato->codigoContato', '$contato->email', '$contato->nome','$observacao', '$contato->sexo', $contato->idUsuarioInsert, $contato->id_usuario_ultima_sincronizacao, 'now()', '$contato->dataInsert')";

                $insert = $this->pdo->exec($sql);
            }
        } catch (Exception $e) {
            echo 'Exceção capturada: ' .  $e->getMessage() . "\n";
        }
    }
}



$contatos = $_POST['contatos'];
$contatos = json_decode($contatos);

$contato = new Contato($pdo);
$contato->insertContato($contatos);
