import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReporFormComponent } from './custom-report-form.component';

describe('CustomReporFormComponent', () => {
  let component: CustomReporFormComponent;
  let fixture: ComponentFixture<CustomReporFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomReporFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomReporFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
