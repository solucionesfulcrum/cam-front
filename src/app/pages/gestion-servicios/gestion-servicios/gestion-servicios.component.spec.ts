import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionServiciosComponent } from './gestion-servicios.component';

describe('GestionServiciosComponent', () => {
  let component: GestionServiciosComponent;
  let fixture: ComponentFixture<GestionServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionServiciosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
