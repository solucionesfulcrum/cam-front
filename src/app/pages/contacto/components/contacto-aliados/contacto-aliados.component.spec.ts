import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoAliadosComponent } from './contacto-aliados.component';

describe('ContactoAliadosComponent', () => {
  let component: ContactoAliadosComponent;
  let fixture: ComponentFixture<ContactoAliadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactoAliadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoAliadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
