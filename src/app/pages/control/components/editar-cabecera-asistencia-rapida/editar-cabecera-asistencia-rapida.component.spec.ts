import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCabeceraAsistenciaRapidaComponent } from './editar-cabecera-asistencia-rapida.component';

describe('EditarCabeceraAsistenciaRapidaComponent', () => {
  let component: EditarCabeceraAsistenciaRapidaComponent;
  let fixture: ComponentFixture<EditarCabeceraAsistenciaRapidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarCabeceraAsistenciaRapidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCabeceraAsistenciaRapidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
