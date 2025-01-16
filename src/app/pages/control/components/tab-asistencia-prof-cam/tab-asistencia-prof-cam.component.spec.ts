import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabAsistenciaProfCamComponent } from './tab-asistencia-prof-cam.component';

describe('TabAsistenciaProfCamComponent', () => {
  let component: TabAsistenciaProfCamComponent;
  let fixture: ComponentFixture<TabAsistenciaProfCamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabAsistenciaProfCamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabAsistenciaProfCamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
