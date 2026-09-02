import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilisateurCreate } from './utilisateur-create';

describe('UtilisateurCreate', () => {
  let component: UtilisateurCreate;
  let fixture: ComponentFixture<UtilisateurCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateurCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
