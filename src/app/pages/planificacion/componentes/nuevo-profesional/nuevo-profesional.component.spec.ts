import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoProfesionalComponent } from './nuevo-profesional.component';

describe('NuevoProfesionalComponent', () => {
  let component: NuevoProfesionalComponent;
  let fixture: ComponentFixture<NuevoProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoProfesionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
