import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUnidOperativaComponent } from './select-unid-operativa.component';

describe('SelectUnidOperativaComponent', () => {
  let component: SelectUnidOperativaComponent;
  let fixture: ComponentFixture<SelectUnidOperativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectUnidOperativaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectUnidOperativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
