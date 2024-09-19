import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaRapidaListaComponent } from './asistencia-rapida-lista.component';

describe('AsistenciaRapidaListaComponent', () => {
  let component: AsistenciaRapidaListaComponent;
  let fixture: ComponentFixture<AsistenciaRapidaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenciaRapidaListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciaRapidaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
