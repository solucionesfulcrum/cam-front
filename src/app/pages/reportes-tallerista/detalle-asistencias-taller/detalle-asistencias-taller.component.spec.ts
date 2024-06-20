import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAsistenciasTallerComponent } from './detalle-asistencias-taller.component';

describe('DetalleAsistenciasTallerComponent', () => {
  let component: DetalleAsistenciasTallerComponent;
  let fixture: ComponentFixture<DetalleAsistenciasTallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleAsistenciasTallerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleAsistenciasTallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
