import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AjaxService } from './../services/ajax_service';
import swal from 'sweetalert';
import * as $ from 'jquery';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'player_creator',
  templateUrl: './player-creator.component.html',
  styleUrls: ['./player-creator.component.css']
})

export class PlayerCreatorComponent implements OnInit {

  public selected_count: number = 0;

  public selected_players: any = [];
  public players: any = [];
  public teams: any = [];
  public get_team_and_players: any = [];

  public player_name: string = "";
  public team_color: string = "";
  public player_post: any = "Kapus";
  public player_age;

  public flashMessage;

  public please_choose: boolean = false;

  public selected_player: string = "";

  public available_players: boolean = false;
  public players_to_team: boolean = false;
  public ptt: boolean = false;
  public team_id: number;
  public player_id: number;

  public choosed_team: string = "";

  constructor(private ajax: AjaxService, private router: Router) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        window.scroll(0, 0);
      });
  }

  ngOnInit() {
    this.please_choose = true;
    this.players_to_team = false;
    this.available_players = false;
    this.ajax.ajxCall("/player_manager.php?fkt=player_check", {}).subscribe(res => {
      this.players = res.json().team_players;
      this.teams = res.json().teams;
      if (this.teams.length != 0) {
        this.team_id = this.teams[0].ID;
      }
      if (this.players.length != 0) {
        this.available_players = true;
      }
      if (this.teams.length != 0 && this.players.length != 0) {
        this.ptt = true;
      } else {
        this.ptt = false;
      }
    });
  }

  public getSelected() {
    this.selected_players = this.players.filter(s => {
      return s.selected;
    });
    this.selected_count = this.selected_players.length;
  }

  public save_players_to_team() {

    let kapus_counter: number = 0;
    let hatved_counter: number = 0;
    let kozeppalyas_counter: number = 0;
    let csatar_counter: number = 0;

    for (let i = 0; i < this.selected_players.length; i++) {
      if (this.selected_players[i].position == "Kapus") {
        kapus_counter++;
      }
      if (this.selected_players[i].position == "Hátvéd") {
        hatved_counter++;
      }
      if (this.selected_players[i].position == "Középpályás") {
        kozeppalyas_counter++;
      }
      if (this.selected_players[i].position == "Csatár") {
        csatar_counter++;
      }
    }

    if(kapus_counter > 1){
      swal({
        title: "Hiba!",
        text: "Egynél több kapust nem lehet csapathoz rendelni!",
        icon: "warning",
        dangerMode: true,
      })
    } else if (hatved_counter > 4){
      swal({
        title: "Hiba!",
        text: "Négynél több hátvédet nem lehet csapathoz rendelni!",
        icon: "warning",
        dangerMode: true,
      })
    } else if(kozeppalyas_counter > 4) {
      swal({
        title: "Hiba!",
        text: "Négynél több középpályást nem lehet csapathoz rendelni!",
        icon: "warning",
        dangerMode: true,
      })
    } else if (csatar_counter > 2) {
      swal({
        title: "Hiba!",
        text: "Egynél több csatárt nem lehet csapathoz rendelni!",
        icon: "warning",
        dangerMode: true,
      })
    } else{
      this.ajax.ajxCall("/player_manager.php?fkt=delete_players_to_teams", { team_id: this.team_id }).subscribe(res => {
      });
  
      for (let i = 0; i < this.selected_players.length; i++) {
        this.ajax.ajxCall("/player_manager.php?fkt=save_players_to_teams", { team_id: this.team_id, player_id: this.selected_players[i].ID }).subscribe(res => {
          let myMessage = document.getElementById("flashMessage");
          if (!myMessage) {
            myMessage = document.createElement("div");
            myMessage.setAttribute("id", "flashMessage");
            let body = document.getElementsByTagName('body')[0];
            myMessage.innerHTML = "";
            body.appendChild(myMessage);
          }
          myMessage.innerHTML = "<div class='text-center alert alert-info'>Sikeres mentés!</div>";
          $("#flashMessage").stop().fadeIn(500);
          let timer = setTimeout(function () {
            // var body = document.getElementsByTagName('body')[0];
            $("#flashMessage").fadeOut(2000, function () {
              myMessage.innerHTML = ""
              //body.removeChild(myFlash)
            });
          }, 2000);
        });
      }
    }
  }

  public new_player() {
    this.player_name = "";
    this.player_post = "Kapus";
    this.player_age = "";
  }

  public delete(index) {
    this.player_id = this.players[index].ID;
    this.ajax.ajxCall("/player_manager.php?fkt=player_delete", { player_id: this.player_id }).subscribe(res => {
      swal("Törlés sikeres", "", "success");
      this.ngOnInit();
    });
  }

  public get_players() {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].selected = false;
    }
    this.ajax.ajxCall("/player_manager.php?fkt=get_players", {}).subscribe(res => {
      this.get_team_and_players = res.json().team_and_players;
      for (let i = 0; i < this.get_team_and_players.length; i++) {

        if (this.get_team_and_players[i].t_id == this.team_id) {
          for (let j = 0; j < this.players.length; j++) {

            if (this.get_team_and_players[i].p_id == this.players[j].ID) {
              this.players[j].selected = true;
            }
          }
        }
      }
    });
  }

  public add_players_to_team() {
    this.selected_players = [];
    this.team_id = this.teams[0].ID;
    this.choosed_team = this.teams[0].team_name;
    this.team_color = this.teams[0].team_color;
    this.players_to_team = true;
    this.get_players();
  }

  public selectTeam(event: any) {
    for (let i = 0; i < this.teams.length; i++) {
      if (this.teams[i].team_name == event.target.value) {
        this.team_color = this.teams[i].team_color;
        this.team_id = this.teams[i].ID;
      }
    }
    this.get_players();
  }

  public modification(index) {
    this.player_id = this.players[index].ID;
    this.player_name = this.players[index].name;
    this.player_post = this.players[index].position;
    this.player_age = this.players[index].age;
  }

  public saveModification() {
    let available_player: boolean = false;
    for (let i = 0; i < this.players.length; i++) {
      if (this.player_name == this.players[i].name && this.player_id != this.players[i].ID) {
        //console.log(this.players[i].ID);
        available_player = true;
      }
    }
    if (this.player_name == "" || this.player_age == "") {
      swal({
        title: "Hiba!",
        text: "Kérem adja meg a játékos nevét, illetve korát!",
        icon: "warning",
        dangerMode: true,
      })
    } else if (available_player == true) {
      swal({
        title: "Hiba!",
        text: "Igyen a névvel és adatokkal játékos már létezik",
        icon: "warning",
        dangerMode: true,
      })
    } else {
      this.ajax.ajxCall("/player_manager.php?fkt=player_name_change", {
        player_id: this.player_id, player_name: this.player_name, player_post: this.player_post, player_age: this.player_age
      }).subscribe(res => {
        swal("Sikeres módosítás", "", "success");
        this.ngOnInit();
      });
    }
  }

  public saveChangesButton() {
    let available_player: boolean = false;
    for (let i = 0; i < this.players.length; i++) {
      if (this.player_name == this.players[i].name) {
        available_player = true;
      }
    }
    if (this.player_name == "" || this.player_age == "") {
      swal({
        title: "Hiba!",
        text: "Kérem adja meg a játékos nevét, illetve korát!",
        icon: "warning",
        dangerMode: true,
      })
    } else if (available_player == true) {
      swal({
        title: "Hiba!",
        text: "Ilyen a névvel és adatokkal játékos már létezik",
        icon: "warning",
        dangerMode: true,
      })
    } else {
      this.ajax.ajxCall("/player_manager.php?fkt=player_save", {
        player_name: this.player_name, player_post: this.player_post, player_age: this.player_age
      }).subscribe(res => {
        swal("Sikeres mentés", "", "success");
        this.ngOnInit();
      });
    }
  }
}
