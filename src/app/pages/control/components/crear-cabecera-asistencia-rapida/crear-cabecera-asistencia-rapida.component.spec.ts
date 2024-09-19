import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCabeceraAsistenciaRapidaComponent } from './crear-cabecera-asistencia-rapida.component';

describe('CrearCabeceraAsistenciaRapidaComponent', () => {
  let component: CrearCabeceraAsistenciaRapidaComponent;
  let fixture: ComponentFixture<CrearCabeceraAsistenciaRapidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearCabeceraAsistenciaRapidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCabeceraAsistenciaRapidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
