<?php

//require_once('../inc/authentication.php');
require_once('../inc/database.php');
require_once('../inc/config.php');

// get the q parameter from URL
$q = $_GET["q"];

$db = new database();
$results = $db->select('SELECT id, first_name, last_name FROM users');

$hint = "";

// lookup all hints from array if $q is different from 
if ($q !== "") {
  $q = strtolower($q); // retorna os caracteres todo em Maiúsculo
  $len=strlen($q); // retorna o número de caracteres


  for($i = 0; $i < count($results); $i++){

    $first_name = $results[$i]->first_name;
    $last_name = $results[$i]->last_name;
    $id = $results[$i]->id;

      if (stristr($q, substr($first_name." ".$last_name, 0, $len))) {
        if ($hint === "") {
          $hint = $first_name." ".$last_name;
        } else {
          $hint .= "<br> ".$first_name." ".$last_name;
        }
      }
    }
  }

// Output "no suggestion" if no hint was found or output correct values
print_r($hint);
//print_r($hint === "" ? "nenhuma sugestão" : $hint);
