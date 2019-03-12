import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { TeamCreatorComponent } from './team-creator/team-creator.component';
import { PlayerCreatorComponent } from './player-creator/player-creator.component';
import { OverallInterfaceComponent } from './overall-interface/overall-interface.component';

import { AjaxService } from './services/ajax_service';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    TeamCreatorComponent,
    PlayerCreatorComponent,
    OverallInterfaceComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'main_page', pathMatch: 'full' },
      { path: 'main_page', component: MainPageComponent },
      { path: 'team_creator', component: TeamCreatorComponent },
      { path: 'player_creator', component: PlayerCreatorComponent },
      { path: 'overall_interface', component: OverallInterfaceComponent },
      { path: '**', component: MainPageComponent}
    ])
  ],
  providers: [AjaxService],
  bootstrap: [AppComponent]
})
export class AppModule { }
