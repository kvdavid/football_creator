<?php

include "inc/global_inc.php";

function fkt_get_datas($ajax_inp) {
    global $sql;
    $team_id = $ajax_inp->team_id;

    $get_datas = $sql->QueryGetAllRows("select * from p_to_t left join teams ON teams.ID = p_to_t.t_id
        left join players ON players.ID = p_to_t.p_id where team_name != '' and t_id = ?", [$team_id]);
    outputArr2Json(['datas' => $get_datas]);
}

?>