import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoRpsUsersComponent } from './contacto-rps-users.component';

describe('ContactoRpsUsersComponent', () => {
  let component: ContactoRpsUsersComponent;
  let fixture: ComponentFixture<ContactoRpsUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactoRpsUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoRpsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
