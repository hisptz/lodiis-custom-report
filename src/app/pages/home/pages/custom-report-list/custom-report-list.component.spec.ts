import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReportListComponent } from './rcustom-report-list.component';

describe('CustomReportListComponent', () => {
  let component: CustomReportListComponent;
  let fixture: ComponentFixture<CustomReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomReportListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
