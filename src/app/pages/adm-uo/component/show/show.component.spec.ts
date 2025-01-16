import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowComponent } from './show.component';

describe('EditComponent', () => {
  let component: ShowComponent;
  let fixture: ComponentFixture<ShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
