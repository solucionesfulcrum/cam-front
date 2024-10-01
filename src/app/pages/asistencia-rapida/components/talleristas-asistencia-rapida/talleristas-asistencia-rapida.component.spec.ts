import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalleristasAsistenciaRapidaComponent } from './talleristas-asistencia-rapida.component';

describe('TalleristasAsistenciaRapidaComponent', () => {
  let component: TalleristasAsistenciaRapidaComponent;
  let fixture: ComponentFixture<TalleristasAsistenciaRapidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalleristasAsistenciaRapidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalleristasAsistenciaRapidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
