import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionTalleresComponent } from './programacion-talleres.component';

describe('ProgramacionTalleresComponent', () => {
  let component: ProgramacionTalleresComponent;
  let fixture: ComponentFixture<ProgramacionTalleresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramacionTalleresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramacionTalleresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
