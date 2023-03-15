import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoCiramComponent } from './nuevo-ciram.component';

describe('NuevoCiramComponent', () => {
  let component: NuevoCiramComponent;
  let fixture: ComponentFixture<NuevoCiramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoCiramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoCiramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
