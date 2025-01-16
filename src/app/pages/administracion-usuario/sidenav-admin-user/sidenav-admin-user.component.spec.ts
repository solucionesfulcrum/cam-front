import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavAdminUserComponent } from './sidenav-admin-user.component';

describe('SidenavAdminUserComponent', () => {
  let component: SidenavAdminUserComponent;
  let fixture: ComponentFixture<SidenavAdminUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavAdminUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavAdminUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
