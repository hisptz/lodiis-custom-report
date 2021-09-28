import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataValidatorComponent } from './metadata-validator.component';

describe('MetadataValidatorComponent', () => {
  let component: MetadataValidatorComponent;
  let fixture: ComponentFixture<MetadataValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
