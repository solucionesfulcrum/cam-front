import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoTabNotasComponent } from './contacto-tab-notas.component';

describe('ContactoTabNotasComponent', () => {
  let component: ContactoTabNotasComponent;
  let fixture: ComponentFixture<ContactoTabNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactoTabNotasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoTabNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
