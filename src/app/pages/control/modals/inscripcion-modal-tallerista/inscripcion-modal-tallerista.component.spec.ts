import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionModalTalleristaComponent } from './inscripcion-modal-tallerista.component';

describe('InscripcionModalTalleristaComponent', () => {
  let component: InscripcionModalTalleristaComponent;
  let fixture: ComponentFixture<InscripcionModalTalleristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscripcionModalTalleristaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionModalTalleristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
