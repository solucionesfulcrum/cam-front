import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSubProgramaComponent } from './crear-sub-programa.component';

describe('CrearSubProgramaComponent', () => {
  let component: CrearSubProgramaComponent;
  let fixture: ComponentFixture<CrearSubProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearSubProgramaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearSubProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
