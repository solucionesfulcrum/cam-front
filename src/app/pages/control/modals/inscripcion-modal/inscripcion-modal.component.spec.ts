import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionModalComponent } from './inscripcion-modal.component';

describe('InscripcionModalComponent', () => {
  let component: InscripcionModalComponent;
  let fixture: ComponentFixture<InscripcionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscripcionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
