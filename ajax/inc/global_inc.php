<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
include "./inc/mssql_inc.php";
include './inc/param_inc.php';

$ajax_inp = json_decode(file_get_contents("php://input"));

$sql = new SQL();

if (@$_GET['fkt']) {
    $func = "fkt_" . $_GET['fkt'];

    if (function_exists($func)) {

        $tmp = file_get_contents("php://input");
        $inpdata = json_decode($tmp);

        $func($inpdata);
    } else {
        print_r("No function found");
    }
}

function outputArr2Json($arr) {
    echo (json_encode($arr));
}