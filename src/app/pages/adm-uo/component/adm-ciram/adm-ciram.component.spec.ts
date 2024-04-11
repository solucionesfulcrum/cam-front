import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmCiramComponent } from './adm-ciram.component';

describe('AdmCiramComponent', () => {
  let component: AdmCiramComponent;
  let fixture: ComponentFixture<AdmCiramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmCiramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmCiramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
