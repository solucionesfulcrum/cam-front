import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRoleComponent } from './show-role.component';

describe('ShowComponent', () => {
  let component: ShowRoleComponent;
  let fixture: ComponentFixture<ShowRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ShowRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
