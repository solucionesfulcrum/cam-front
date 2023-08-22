import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAfilComponent } from './ficha-afil.component';

describe('FichaAfilComponent', () => {
  let component: FichaAfilComponent;
  let fixture: ComponentFixture<FichaAfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaAfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaAfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
