import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAfilComponent } from './show-afil.component';

describe('ShowAfilComponent', () => {
  let component: ShowAfilComponent;
  let fixture: ComponentFixture<ShowAfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
