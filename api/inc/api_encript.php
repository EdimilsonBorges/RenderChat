<?php

class api_encript
{

    static function aesEncriptar($valor)
    {
        return bin2hex(openssl_encrypt($valor, "aes-256-cbc", AES_KEY, OPENSSL_RAW_DATA, AES_IV));
    }

    static function aesDesencriptar($valor)
    {

        return openssl_decrypt(hex2bin($valor), "aes-256-cbc", AES_KEY, OPENSSL_RAW_DATA, AES_IV);
    }
}
