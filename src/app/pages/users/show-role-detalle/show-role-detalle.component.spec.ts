import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRoleDetalleComponent } from './show-role-detalle.component';

describe('ShowRoleDetalleComponent', () => {
  let component: ShowRoleDetalleComponent;
  let fixture: ComponentFixture<ShowRoleDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowRoleDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowRoleDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
