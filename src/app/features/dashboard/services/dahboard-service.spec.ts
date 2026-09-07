import { TestBed } from '@angular/core/testing';
import { DahboardService } from './dahboard-service';

describe('DahboardService', () => {
  let service: DahboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DahboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
