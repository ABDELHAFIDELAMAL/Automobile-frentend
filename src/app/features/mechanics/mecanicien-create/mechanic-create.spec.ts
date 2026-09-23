import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MechanicCreate } from './mechanic-create';

describe('MechanicCreate', () => {
  let component: MechanicCreate;
  let fixture: ComponentFixture<MechanicCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechanicCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(MechanicCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
