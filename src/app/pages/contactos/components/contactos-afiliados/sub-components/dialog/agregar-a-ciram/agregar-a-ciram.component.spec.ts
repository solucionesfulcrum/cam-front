import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarACiramComponent } from './agregar-a-ciram.component';

describe('AgregarACiramComponent', () => {
  let component: AgregarACiramComponent;
  let fixture: ComponentFixture<AgregarACiramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarACiramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarACiramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
