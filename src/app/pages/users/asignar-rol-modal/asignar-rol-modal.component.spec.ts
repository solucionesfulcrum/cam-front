import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRolModalComponent } from './asignar-rol-modal.component';

describe('AsignarRolModalComponent', () => {
  let component: AsignarRolModalComponent;
  let fixture: ComponentFixture<AsignarRolModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarRolModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarRolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
