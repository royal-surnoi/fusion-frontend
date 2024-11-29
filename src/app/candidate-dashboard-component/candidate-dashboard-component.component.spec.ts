import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDashboardComponentComponent } from './candidate-dashboard-component.component';

describe('CandidateDashboardComponentComponent', () => {
  let component: CandidateDashboardComponentComponent;
  let fixture: ComponentFixture<CandidateDashboardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateDashboardComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateDashboardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
