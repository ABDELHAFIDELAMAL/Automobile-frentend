import { TestBed } from '@angular/core/testing';
import { VehicleService } from './vehicule';

describe('Vehicle', () => {
  let service: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
