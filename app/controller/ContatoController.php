<?php


class ContatoController 
{

    public function getcontatoDB()
    {

        $contatoDB = $_POST['contatoDB'];
        $getContatos = new ContatoModel();
        $contatosteste = $getContatos->getContatosDB($contatoDB);
    
        foreach ($contatosteste as $key => $sql) {
            $contatosteste[$key]['telefone'] = explode(',', $sql['telefone']);
        }
        $response['dados'] = $contatosteste;
    
        $json = json_encode($response);
        echo $json;
    }
      
    public function salvar()
    {
        $contatoValidacao = new ContatoValidacao();
        $contatos = json_decode($_POST['contatos']);

        foreach ($contatos as $contato) {
            $contatoFilter = new ContatoFilter();
            $contato->email = $contatoFilter->filtrarEmail($contato->email);
            $contato->nome = $contatoFilter->filtrarNome($contato->nome);
            $contato->observacao = $contatoFilter->filtrarObs($contato->observacao);
    
            if ($contatoValidacao->validarDados($contato) === false) {
                $erro = true;
                continue;
            }
    
            if ($contato->observacao === '') {
                $contato->observacao = 'NULL';
            }
        }
    
        $salvar = new ContatoModel();
        $salvar->salvar($contatos);
    }

    public function excluir()
    {
        $idContato = $_POST['idContato'];
        $contato = new ContatoModel();
        $contato->deleteContato($idContato);
    }
}

