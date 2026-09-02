import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MecanicienCreate } from './mecanicien-create';

describe('MecanicienCreate', () => {
  let component: MecanicienCreate;
  let fixture: ComponentFixture<MecanicienCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MecanicienCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(MecanicienCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
