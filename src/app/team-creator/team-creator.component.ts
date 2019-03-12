import { Component, OnInit } from '@angular/core';
import { AjaxService } from './../services/ajax_service';
import swal from 'sweetalert';

@Component({
  selector: 'team_creator',
  templateUrl: './team-creator.component.html',
  styleUrls: ['./team-creator.component.css']
})
export class TeamCreatorComponent implements OnInit {

  public team_name: string = "";
  public team_color: string = "#000000";
  public selected_item: string = "";

  public teams_available: boolean = true;

  public teams: any = [];
  public team_id: any = [];
  public standard: boolean = true;
  public please_choose: boolean = true;

  public new_team: boolean = false;

  constructor(private ajax: AjaxService) { }

  ngOnInit() {
    this.new_team = false;
    this.please_choose = true;
    this.team_name = "";
    this.standard = true;
    this.selected_item = "";
    this.ajax.ajxCall("/team_manager.php?fkt=team_checker", {}).subscribe(res => {
      this.teams = res.json().team_checker;
      if (this.teams.length != 0) {
        this.teams_available = true;
      } else {
        this.teams_available = false;
      }
    });
  }

  public selectChangeTeam(event: any) {
    this.selected_item = event.target.value;
    this.new_team = true;
    for (let i = 0; i < this.teams.length; i++) {
      if (this.teams[i].team_name == event.target.value) {
        this.team_color = this.teams[i].team_color;
        this.team_name = this.teams[i].team_name;
        this.team_id = this.teams[i].ID;
        this.please_choose = false;
        this.standard = false;
      }
    }
  }

  public delete() {
    this.ajax.ajxCall("/team_manager.php?fkt=team_delete", { team_id: this.team_id }).subscribe(res => {
      swal("Törlés sikeres", "", "success");
      this.ngOnInit();
    });
  }

  public back_to_new_team() {
    this.ngOnInit();
  }

  public saveChangesButton() {
    let available_team: boolean = false;
    let orginal_color: string = "#000000";

    for (let i = 0; i < this.teams.length; i++) {
      if (this.teams[i].team_name == this.team_name) {
        available_team = true;
        orginal_color = this.teams[i].team_color;
      }
    }

    if (this.team_name == "") {
      swal({
        title: "Hiba!",
        text: "Adj meg egy csapatnevet!",
        icon: "warning",
        dangerMode: true,
      })
    } else if (available_team == true) {
      swal({
        title: "Hiba!",
        text: "Csapatnév már létezik!",
        icon: "warning",
        dangerMode: true,
      })
    }
    else if (this.selected_item != '' && this.selected_item != this.team_name) {
      this.ajax.ajxCall("/team_manager.php?fkt=team_name_change", { team_name: this.team_name, team_color: this.team_color, team_id: this.team_id }).subscribe(res => {
        swal("Sikeres mentés", "", "success");
        this.ngOnInit();
      });
    } else if (this.selected_item != '' && this.selected_item == this.team_name &&this.team_color != orginal_color) {
      this.ajax.ajxCall("/team_manager.php?fkt=team_name_change", { team_name: this.team_name, team_color: this.team_color, team_id: this.team_id }).subscribe(res => {
        swal("Sikeres mentés", "", "success");
        this.ngOnInit();
      });
    } else {
      this.ajax.ajxCall("/team_manager.php?fkt=team_save", { team_name: this.team_name, team_color: this.team_color }).subscribe(res => {
        swal("Sikeres mentés", "", "success");
        this.ngOnInit();
      });
    }
  }
}