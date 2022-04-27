import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReporActionComponent } from './custom-report-action.component';

describe('CustomReporActionComponent', () => {
  let component: CustomReporActionComponent;
  let fixture: ComponentFixture<CustomReporActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomReporActionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomReporActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
