import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSolComponent } from './edit-sol.component';

describe('EditSolComponent', () => {
  let component: EditSolComponent;
  let fixture: ComponentFixture<EditSolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
