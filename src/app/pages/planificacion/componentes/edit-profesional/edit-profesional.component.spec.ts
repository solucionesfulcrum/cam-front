import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfesionalComponent } from './edit-profesional.component';

describe('EditProfesionalComponent', () => {
  let component: EditProfesionalComponent;
  let fixture: ComponentFixture<EditProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProfesionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
