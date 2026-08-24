import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterventionWizard } from './intervention-wizard';

describe('InterventionWizard', () => {
  let component: InterventionWizard;
  let fixture: ComponentFixture<InterventionWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionWizard],
    }).compileComponents();

    fixture = TestBed.createComponent(InterventionWizard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
