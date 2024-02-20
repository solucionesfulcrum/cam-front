import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAdmisionComponent } from './ficha-admision.component';

describe('FichaAdmisionComponent', () => {
  let component: FichaAdmisionComponent;
  let fixture: ComponentFixture<FichaAdmisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaAdmisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaAdmisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
