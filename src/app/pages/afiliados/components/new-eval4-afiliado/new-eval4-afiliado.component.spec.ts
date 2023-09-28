import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEval4AfiliadoComponent } from './new-eval4-afiliado.component';

describe('NewEval4AfiliadoComponent', () => {
  let component: NewEval4AfiliadoComponent;
  let fixture: ComponentFixture<NewEval4AfiliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEval4AfiliadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEval4AfiliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
