<?php


class ContatoController 
{

    public function getcontatoDB()
    {
        $response = new Response;
        $getContatos = new ContatoModel();
        $contatosDB = $getContatos->getContatosDB();
    
        foreach ($contatosDB as $key => $sql) {
            $contatosDB[$key]['telefone'] = explode(',', $sql['telefone']);
        }
        $response->setDados($contatosDB);    
        
        $response->print();
    }
      
    public function salvar()
    {
        $contatoValidacao = new ContatoValidacao();
        $contatos = json_decode($_POST['contatos']);

        foreach ($contatos as $contato) {
            $contatoFilter = new ContatoFilter();
            $contatoFilter->filtrar($contato);
    
            if ($contatoValidacao->validarDados($contato) === false) {
                continue;
            }

        }
    
        $salvar = new ContatoModel();
        $salvar->salvar($contatos);
    }

    public function excluir()
    {
        $codigosContato = $_POST['CodigosContato'];
        $contato = new ContatoModel();
        $contato->deleteContato($codigosContato);
    }
}

