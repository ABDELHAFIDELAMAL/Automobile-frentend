import { TestBed } from '@angular/core/testing';
import { VehicleService } from './VehicleService';

describe('VehiculeService', () => {
  let service: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
