import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorassignmentComponent } from './mentorassignment.component';

describe('MentorassignmentComponent', () => {
  let component: MentorassignmentComponent;
  let fixture: ComponentFixture<MentorassignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorassignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MentorassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
