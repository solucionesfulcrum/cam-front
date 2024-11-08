import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesExcelComponent } from './reportes-excel.component';

describe('ReportesExcelComponent', () => {
  let component: ReportesExcelComponent;
  let fixture: ComponentFixture<ReportesExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
