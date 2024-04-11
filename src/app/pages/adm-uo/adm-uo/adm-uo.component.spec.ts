import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmUoComponent } from './adm-uo.component';

describe('AdmUoComponent', () => {
  let component: AdmUoComponent;
  let fixture: ComponentFixture<AdmUoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmUoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmUoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
