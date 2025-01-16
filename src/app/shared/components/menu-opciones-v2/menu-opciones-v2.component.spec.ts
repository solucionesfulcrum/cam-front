import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOpcionesV2Component } from './menu-opciones-v2.component';

describe('MenuOpcionesV2Component', () => {
  let component: MenuOpcionesV2Component;
  let fixture: ComponentFixture<MenuOpcionesV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuOpcionesV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuOpcionesV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
