import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDataAcompanianteComponent } from './dialog-data-acompaniante.component';

describe('DialogDataAcompanianteComponent', () => {
  let component: DialogDataAcompanianteComponent;
  let fixture: ComponentFixture<DialogDataAcompanianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDataAcompanianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDataAcompanianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
