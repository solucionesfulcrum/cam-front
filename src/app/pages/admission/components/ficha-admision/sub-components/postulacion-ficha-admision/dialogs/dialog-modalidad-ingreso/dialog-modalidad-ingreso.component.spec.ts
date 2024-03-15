import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModalidadIngresoComponent } from './dialog-modalidad-ingreso.component';

describe('DialogModalidadIngresoComponent', () => {
  let component: DialogModalidadIngresoComponent;
  let fixture: ComponentFixture<DialogModalidadIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogModalidadIngresoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogModalidadIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
