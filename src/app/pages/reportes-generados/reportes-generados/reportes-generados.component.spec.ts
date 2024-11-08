import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesGeneradosComponent } from './reportes-generados.component';

describe('ReportesGeneradosComponent', () => {
  let component: ReportesGeneradosComponent;
  let fixture: ComponentFixture<ReportesGeneradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesGeneradosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesGeneradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
