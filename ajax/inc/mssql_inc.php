<?php

class SQL {

    var $idlink;
    var $result;
    //var $resid;
    var $queryString;
    var $par = array();
    var $transactionAcitivated = false;

    public function SQL($sqlQuery = "", $par = array()) {

        $connectionInfo = array(
            "Database" => SQL_DATABASE,
            "UID" => SQL_USER,
            "PWD" => SQL_PASS,
            'CharacterSet' => 'UTF-8',
        );

        $this->idlink = @sqlsrv_connect(SQL_HOST, $connectionInfo);

        if (!$this->idlink) {
            $this->Error();
        }

        if (trim($sqlQuery)) {
            $this->Query($sqlQuery, $par);
        }
    }

    public function Error() {
        $url = $_SERVER["SERVER_NAME"] . $_SERVER["SCRIPT_NAME"];
        if ($_SERVER["QUERY_STRING"]) {
            $url = "$url?" . $_SERVER["QUERY_STRING"];
        }
        $sqlErr = sqlsrv_errors()[0]['message'];
        $Subj = "CRM SQL error";
        $erromsg = "
Url:$url
Database: " . SQL_HOST . "    
SQL error: <b>$sqlErr</b>\n\n\n" . $this->queryString . "\n

Pars:\n" . print_r($this->par, true);

        if ($this->transactionAcitivated) {
            @sqlsrv_rollback($this->idlink);
        }

        $ret = array('Error' => 1, 'message' => "Database Error, pls contact developer");


        print_r($erromsg);
die();
        echo json_encode($ret);
        exit();

        //echo $erromsg;
        //die();
    }

    public function Query($sqlQuery, $paramsArr = array(), $ysnContinueOnError = 0) {

        $this->par = $paramsArr;
        $this->queryString = $sqlQuery;

        $params = array();
        $options = array("Scrollable" => SQLSRV_CURSOR_KEYSET);

        $this->result = sqlsrv_query($this->idlink, $this->queryString, $paramsArr);
        if ($this->result) {
            return true;
        } else {
            if (!$ysnContinueOnError) {
                	$this->Error();
            }
            return false;
        }
    }

    function QueryGetOneRow($sqlQuery, $paramsArr = array()) {
        $this->Query($sqlQuery, $paramsArr);
        return $this->getRow();
    }

    function QueryGetAllRows($sqlQuery, $paramsArr = array()) {
        $ret = [];
        $this->Query($sqlQuery, $paramsArr);

        while ($row = $this->getRow()) {
            $ret[] = $row;
        }
        return $ret;
    }

    public function getRow() {
        if ($this->result) {
            $res = sqlsrv_fetch_array($this->result, SQLSRV_FETCH_ASSOC);    

            return $res;
        } else
            return false;
    }

}

?>