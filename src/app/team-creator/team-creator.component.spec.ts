import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCreatorComponent } from './team-creator.component';

describe('TeamCreatorComponent', () => {
  let component: TeamCreatorComponent;
  let fixture: ComponentFixture<TeamCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
