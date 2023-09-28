import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultEvalAfiliadoComponent } from './result-eval-afiliado.component';

describe('ResultEvalAfiliadoComponent', () => {
  let component: ResultEvalAfiliadoComponent;
  let fixture: ComponentFixture<ResultEvalAfiliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultEvalAfiliadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultEvalAfiliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
