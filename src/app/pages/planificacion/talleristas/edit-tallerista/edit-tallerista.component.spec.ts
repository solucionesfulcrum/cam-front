import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTalleristaComponent } from './edit-tallerista.component';

describe('EditTalleristaComponent', () => {
  let component: EditTalleristaComponent;
  let fixture: ComponentFixture<EditTalleristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTalleristaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTalleristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
