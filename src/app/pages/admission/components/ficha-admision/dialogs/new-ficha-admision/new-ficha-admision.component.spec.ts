import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFichaAdmisionComponent } from './new-ficha-admision.component';

describe('NewFichaAdmisionComponent', () => {
  let component: NewFichaAdmisionComponent;
  let fixture: ComponentFixture<NewFichaAdmisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFichaAdmisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFichaAdmisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
