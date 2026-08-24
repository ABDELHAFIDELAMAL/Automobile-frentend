import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterventionHistory } from './intervention-history';

describe('InterventionHistory', () => {
  let component: InterventionHistory;
  let fixture: ComponentFixture<InterventionHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(InterventionHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
