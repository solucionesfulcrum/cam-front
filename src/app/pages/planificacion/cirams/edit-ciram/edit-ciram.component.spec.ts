import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCiramComponent } from './edit-ciram.component';

describe('EditCiramComponent', () => {
  let component: EditCiramComponent;
  let fixture: ComponentFixture<EditCiramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCiramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCiramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
