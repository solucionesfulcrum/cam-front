import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleParticipanteComponent } from './detalle-participante.component';

describe('DetalleParticipanteComponent', () => {
  let component: DetalleParticipanteComponent;
  let fixture: ComponentFixture<DetalleParticipanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleParticipanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleParticipanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
