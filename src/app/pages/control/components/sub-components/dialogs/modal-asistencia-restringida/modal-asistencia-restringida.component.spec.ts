import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsistenciaRestringidaComponent } from './modal-asistencia-restringida.component';

describe('ModalAsistenciaRestringidaComponent', () => {
  let component: ModalAsistenciaRestringidaComponent;
  let fixture: ComponentFixture<ModalAsistenciaRestringidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAsistenciaRestringidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAsistenciaRestringidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
