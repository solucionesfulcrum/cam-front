import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesBusquedaComponent } from './opciones-busqueda.component';

describe('OpcionesBusquedaComponent', () => {
  let component: OpcionesBusquedaComponent;
  let fixture: ComponentFixture<OpcionesBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcionesBusquedaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcionesBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
