<?php

class ConfigController{

    private string $url;
    private array $urlConjunto;
    private string $urlController;
    private string $urlMetodo;
    private string $urlParametro;

    public function __construct(){
        if(!empty($_GET['url'])){
            $this->url = $_GET['url'];
            $this->urlConjunto = explode("/",$this->url);

            if(isset($this->urlConjunto[0])){
                $this->urlController = $this->urlConjunto[0];
            }else{
                $this->urlController = "Login";
            }

            if(isset($this->urlConjunto[1])){
                $this->urlMetodo = $this->urlConjunto[1];
                
            }else{
                $this->urlMetodo = "Home";
            }

            if(isset($this->urlConjunto[2])){
                $this->urlParametro = $this->urlConjunto[2];
            }else{
                $this->urlParametro = "";
            }

        }else{
            $this->urlController = "Login";
            $this->urlMetodo = "Home";
            $this->urlParametro = "";
        } 

        echo "Controller {$this->urlController}"; 
        echo "Metodo {$this->urlMetodo}";
        echo "Parametro {$this->urlParametro}";

    }

}