import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSubProgramaComponent } from './editar-sub-programa.component';

describe('EditarSubProgramaComponent', () => {
  let component: EditarSubProgramaComponent;
  let fixture: ComponentFixture<EditarSubProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarSubProgramaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarSubProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
