<?php



class Contato
{

    private $pdo;

    function __construct($pdo)
    {
        $this->pdo = include './conection.php';
    }

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

    function validar_nome($nomeContato)
    {
        if (empty($nomeContato)) {
            return;
        }

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
             * 
             * @author Carlos Augusto <carlos@icsgo.com.br>
             * 
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

    function validar_sexo($sexoContato)
    {
        if ($sexoContato !== 'M' && $sexoContato !== 'F') {
            return false;
        }
    }

    function validar_email($emailContato)
    {
        if (filter_var($emailContato, FILTER_VALIDATE_EMAIL)) {
            return true;
        } else {
            return false;
        }
    }

    function validar_id($idContato)
    {
        if ($idContato < -32768 || $idContato >	32768) {
            return false;
        };
    }

    function validar_data($data)
    {
        // echo $data;
        $dataExplode = (explode(" ",$data)); 
        $teste =  substr('$dataExplode', 0, -1);
        echo '<br>';
        print_r($dataExplode);
    }

    function validar($contato) 
    {
     
        try {

            if($this->validar_email($contato->email) === false)
            {
                throw 'Email invalido!';
            } 

            if ($this->validar_nome($contato->nome) === false )
            {
                throw 'Nome do contato invalido.';
            }

            if($this->validar_sexo($contato->sexo) === false)
            {
                throw 'Sexo invalido!';
            }

            if($this->validar_id($contato->idUsuarioInsert)){
                throw 'Erro';
            }

            if($this->validar_id($contato->id_usuario_ultima_sincronizacao)){
                throw 'Erro';
            }

            // if($this->validar_data)

            return true;

        } catch (Exception $e) {
            echo 'Exceção capturada: ' .  $e->getMessage() . "\n";
        }
    }


    public function insertContato(array $contatos)
    {
    

        try {

            foreach ($contatos as $contato) {
                $this->validar_data($contato->dataInsert);

                $contato->email = $this->filtrar_email($contato);
                $contato->nome = $this->filtrar_nome($contato);
                $contato->observacao = $this->filtrar_obs($contatos);
                
                $observacao = $contato->observacao;
                if ($observacao = ''){
                    $observacao = 'NULL';
                }

                // $this->validar($contato);

                $sql = "INSERT INTO contato (id_contato,email,nome,observacao,sexo, data_ultima_sincronizacao, data_insert,id_usuario_ultima_sincronizacao,id_usuario_insert) VALUES ('$contato->codigoContato', '$contato->email', '$contato->nome','$observacao', '$contato->sexo', 'now()', '$contato->dataInsert', $contato->id_usuario_ultima_sincronizacao, $contato->idUsuarioInsert)";

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
