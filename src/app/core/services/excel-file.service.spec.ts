import { TestBed } from '@angular/core/testing';

import { ExcelFileService } from './excel-file.service';

describe('ExcelFileService', () => {
  let service: ExcelFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
