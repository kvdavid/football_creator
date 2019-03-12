import { Component, OnInit } from '@angular/core';
import { AjaxService } from './../services/ajax_service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'overall_interface',
  templateUrl: './overall-interface.component.html',
  styleUrls: ['./overall-interface.component.css']
})
export class OverallInterfaceComponent implements OnInit {

  public please_choose: boolean = true;
  public team_selected: boolean = false;

  public teams: any = [];
  public datas: any = [];

  public team_color: string = "";
  public team_id: number = 0;

  public kapus: any = [];
  public hatvedek: any = [];
  public kozeppalyasok:any = [];
  public csatarok: any = [];

  public kapus_available: boolean = false;
  public csatar_available: boolean = false;
  public hatved_available: boolean = false;
  public kozeppalyas_available: boolean = false;

  constructor(private ajax: AjaxService) { }

  ngOnInit() {
    this.please_choose = true;
    this.ajax.ajxCall("/team_manager.php?fkt=team_checker", {}).subscribe(res => {
      this.teams = res.json().team_checker;
      this.team_color = this.teams[0].team_color;
    });
  }

  public team_choosed(event: any) {

    this.kapus = [];
    this.hatvedek = [];
    this.kozeppalyasok = [];
    this.csatarok = [];
    
    this.kapus_available = false;
    this.csatar_available = false;
    this.hatved_available = false;
    this.kozeppalyas_available = false;

    for (let i = 0; i < this.teams.length; i++) {
      if (this.teams[i].team_name == event.target.value) {
        this.team_color = this.teams[i].team_color;
        this.team_id = this.teams[i].ID;
      }
    }
    this.please_choose = false;
    this.team_selected = true;
    this.ajax.ajxCall("/overall.php?fkt=get_datas", { team_id: this.team_id }).subscribe(res => {
      this.datas = res.json().datas;
      for (let i = 0; i < this.datas.length; i++) {
        if (this.datas[i].position == "Kapus") {
          this.kapus.name = this.datas[i].name;
          this.kapus.age = this.datas[i].age;
          this.kapus_available = true;
        }
        if (this.datas[i].position == "Hátvéd") {
          this.hatvedek.push({names: this.datas[i].name, ages: this.datas[i].age});
          this.hatved_available = true;
        }
        if (this.datas[i].position == "Középpályás") {
          this.kozeppalyasok.push({names: this.datas[i].name, ages: this.datas[i].age});
          this.kozeppalyas_available = true;
        }
        if (this.datas[i].position == "Csatár") {
          this.csatarok.push({names: this.datas[i].name, ages: this.datas[i].age});
          this.csatar_available = true;

        }
      }
    });
  }

}
