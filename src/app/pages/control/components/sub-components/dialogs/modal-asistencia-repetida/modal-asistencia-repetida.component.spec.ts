import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsistenciaRepetidaComponent } from './modal-asistencia-repetida.component';

describe('ModalAsistenciaRepetidaComponent', () => {
  let component: ModalAsistenciaRepetidaComponent;
  let fixture: ComponentFixture<ModalAsistenciaRepetidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAsistenciaRepetidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAsistenciaRepetidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
