import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReportTableComponent } from './custom-report-table.component';

describe('CustomReportTableComponent', () => {
  let component: CustomReportTableComponent;
  let fixture: ComponentFixture<CustomReportTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomReportTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
