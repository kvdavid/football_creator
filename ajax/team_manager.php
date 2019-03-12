<?php

include "inc/global_inc.php";

function fkt_team_checker($ajax_inp) {
    global $sql;

    $team_checker = $sql->QueryGetAllRows("select * from teams where team_name != ''");
    outputArr2Json(['team_checker' => $team_checker]);
}

function fkt_team_save($ajax_inp) {
    global $sql;

    $team_name = $ajax_inp->team_name;
    $team_color = $ajax_inp->team_color;

    $sql->Query("INSERT INTO teams (team_name, team_color) VALUES (?, ?)", [$team_name, $team_color]);
}

function fkt_team_name_change($ajax_inp) {
    global $sql;

    $team_id = $ajax_inp->team_id;
    $team_name = $ajax_inp->team_name;
    $team_color = $ajax_inp->team_color;

    $sql->Query("UPDATE teams SET team_name = ?, team_color = ? WHERE ID = ?", [$team_name, $team_color, $team_id]);
}

function fkt_team_delete($ajax_inp) {
    global $sql;

    $team_id = $ajax_inp->team_id;

    $sql->Query("DELETE FROM teams WHERE ID = ? OR team_name IS NULL", [$team_id]);
}

?>