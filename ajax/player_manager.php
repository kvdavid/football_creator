<?php

include "inc/global_inc.php";

function fkt_player_check($ajax_inp) {
    global $sql;

    $team_players = $sql->QueryGetAllRows("  SELECT * FROM players WHERE name != '' ORDER BY name ASC");
    $teams = $sql->QueryGetAllRows("SELECT * FROM teams WHERE team_name != '' ORDER BY team_name ASC");
    outputArr2Json(['team_players' => $team_players, 'teams' => $teams]);
}

function fkt_player_name_change($ajax_inp) {
    global $sql;

    $player_id = $ajax_inp->player_id;
    $player_name = $ajax_inp->player_name;
    $player_post = $ajax_inp->player_post;
    $player_age = $ajax_inp->player_age;

    $sql->Query("UPDATE players SET name = ?, age = ?, position = ? WHERE ID = ?", [$player_name, $player_age, $player_post, $player_id]);
}

function fkt_player_delete($ajax_inp) {
    global $sql;

    $player_id = $ajax_inp->player_id;
    $sql->Query("DELETE FROM players WHERE ID = ? OR name IS NULL", [$player_id]);
}

function fkt_player_save($ajax_inp) {
    global $sql;

    $player_name = $ajax_inp->player_name;
    $player_post = $ajax_inp->player_post;
    $player_age = $ajax_inp->player_age;

    $sql->Query("INSERT INTO players (name, age, position) VALUES (?, ?, ?)", [$player_name, $player_age, $player_post]);
}

function fkt_get_players($ajax_inp) {
    global $sql;

    $teams_and_players = $sql->QueryGetAllRows("SELECT * FROM p_to_t");
    outputArr2Json(['team_and_players' => $teams_and_players]);
}

function fkt_save_players_to_teams($ajax_inp) {
    global $sql;

    $team_id = $ajax_inp->team_id;
    $player_id = $ajax_inp->player_id;

    $sql->Query("IF NOT EXISTS (SELECT * FROM p_to_t where t_id = ? and p_id = ?)
    INSERT INTO p_to_t (t_id, p_id) VALUES (?, ?)", [$team_id, $player_id, $team_id, $player_id]);
}

function fkt_delete_players_to_teams($ajax_inp) {
    global $sql;

    $team_id = $ajax_inp->team_id;

    $sql->Query("DELETE FROM p_to_t WHERE t_id=?", [$team_id]);
}

?>