<?php

class api_response
{
    private $data;
    private $avaliable_method = ['GET', 'POST'];

    public function __construct()
    {
        $this->data = [];
    }

    public function check_method($method)
    {
        return in_array($method, $this->avaliable_method);
    }

    public function api_request_error($message = '')
    {
        $data_error = [
            'status' => 'ERROR',
            'message' => $message,
        ];

        $this->data['data'] = $data_error;
        $this->send_response();
    }

    public function send_api_status()
    {
        $this->data['status'] = 'SUCESS';
        $this->data['message'] = 'A api está rodando normal';
        $this->send_response();
    }

    public function set_method($method)
    {
        $this->data['method'] = $method;
    }

    public function get_method()
    {
        return $this->data['method']; 
    }

    public function set_endpoint($endpoint)
    {
        $this->data['endpoint'] = $endpoint;
    }

    public function get_endpoint()
    {
        return $this->data['endpoint'];
    }

    public function add_to_data($key, $value){
        $this->data[$key] = $value;
    }

    public function send_response()
    {
        header("Content-Type:application/json");
        echo json_encode($this->data);
        die(1);
    }
}
