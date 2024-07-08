import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosBusquedaComponent } from './contactos-busqueda.component';

describe('ContactosBusquedaComponent', () => {
  let component: ContactosBusquedaComponent;
  let fixture: ComponentFixture<ContactosBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactosBusquedaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactosBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
