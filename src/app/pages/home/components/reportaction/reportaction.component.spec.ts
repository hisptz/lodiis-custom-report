import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportactionComponent } from './reportaction.component';

describe('ReportactionComponent', () => {
  let component: ReportactionComponent;
  let fixture: ComponentFixture<ReportactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
