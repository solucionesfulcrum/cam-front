import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTalleristaSesionesComponent } from './control-tallerista-sesiones.component';

describe('ControlTalleristaSesionesComponent', () => {
  let component: ControlTalleristaSesionesComponent;
  let fixture: ComponentFixture<ControlTalleristaSesionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlTalleristaSesionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlTalleristaSesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
