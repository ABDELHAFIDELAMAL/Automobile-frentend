import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterventionCreate } from './intervention-create';

describe('InterventionCreate', () => {
  let component: InterventionCreate;
  let fixture: ComponentFixture<InterventionCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(InterventionCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
