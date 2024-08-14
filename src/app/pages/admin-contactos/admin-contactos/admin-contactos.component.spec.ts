import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContactosComponent } from './admin-contactos.component';

describe('AdminContactosComponent', () => {
  let component: AdminContactosComponent;
  let fixture: ComponentFixture<AdminContactosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminContactosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminContactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
