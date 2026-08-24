import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehiculeCreate } from './vehicule-create';

describe('VehiculeCreate', () => {
  let component: VehiculeCreate;
  let fixture: ComponentFixture<VehiculeCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculeCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculeCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
