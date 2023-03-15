import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoTalleristaComponent } from './nuevo-tallerista.component';

describe('NuevoTalleristaComponent', () => {
  let component: NuevoTalleristaComponent;
  let fixture: ComponentFixture<NuevoTalleristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoTalleristaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoTalleristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
