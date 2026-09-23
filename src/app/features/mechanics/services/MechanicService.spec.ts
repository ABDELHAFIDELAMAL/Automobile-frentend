import { TestBed } from '@angular/core/testing';
import { MechanicService } from './mechanicService';

describe('MechanicService', () => {
  let service: MechanicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MechanicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
