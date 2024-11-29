import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateActivtiesComponent } from './candidate-activties.component';

describe('CandidateActivtiesComponent', () => {
  let component: CandidateActivtiesComponent;
  let fixture: ComponentFixture<CandidateActivtiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateActivtiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateActivtiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
