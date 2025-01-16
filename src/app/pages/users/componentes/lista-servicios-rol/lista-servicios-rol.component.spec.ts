import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaServiciosRolComponent } from './lista-servicios-rol.component';

describe('ListaServiciosRolComponent', () => {
  let component: ListaServiciosRolComponent;
  let fixture: ComponentFixture<ListaServiciosRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaServiciosRolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaServiciosRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
