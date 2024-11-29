import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentordashboardComponent } from './mentordashboard.component';

describe('MentordashboardComponent', () => {
  let component: MentordashboardComponent;
  let fixture: ComponentFixture<MentordashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentordashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MentordashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
