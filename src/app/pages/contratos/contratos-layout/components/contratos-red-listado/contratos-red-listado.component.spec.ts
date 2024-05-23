import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosRedListadoComponent } from './contratos-red-listado.component';

describe('ContratosRedListadoComponent', () => {
  let component: ContratosRedListadoComponent;
  let fixture: ComponentFixture<ContratosRedListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratosRedListadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratosRedListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
