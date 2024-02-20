import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveUserModalComponent } from './active-user-modal.component';

describe('ActiveUserModalComponent', () => {
  let component: ActiveUserModalComponent;
  let fixture: ComponentFixture<ActiveUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveUserModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
