import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPersonalizadoComponent } from './select-personalizado.component';

describe('SelectPersonalizadoComponent', () => {
  let component: SelectPersonalizadoComponent;
  let fixture: ComponentFixture<SelectPersonalizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPersonalizadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectPersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
