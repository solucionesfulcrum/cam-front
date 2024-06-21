import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTalleristaComponent } from './control-tallerista.component';

describe('ControlTalleristaComponent', () => {
  let component: ControlTalleristaComponent;
  let fixture: ComponentFixture<ControlTalleristaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlTalleristaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlTalleristaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
