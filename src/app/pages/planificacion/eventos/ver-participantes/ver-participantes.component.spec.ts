import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerParticipantesComponent } from './ver-participantes.component';

describe('VerParticipantesComponent', () => {
  let component: VerParticipantesComponent;
  let fixture: ComponentFixture<VerParticipantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerParticipantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerParticipantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
