import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProgramaComponent } from './crear-programa.component';

describe('CrearProgramaComponent', () => {
  let component: CrearProgramaComponent;
  let fixture: ComponentFixture<CrearProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearProgramaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
