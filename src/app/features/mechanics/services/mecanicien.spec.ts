import { TestBed } from '@angular/core/testing';
import { MecanicienService } from './mecanicien';

describe('Mecanicien', () => {
  let service: MecanicienService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MecanicienService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
