import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsviewComponent } from './metricsview.component';

describe('MetricsviewComponent', () => {
  let component: MetricsviewComponent;
  let fixture: ComponentFixture<MetricsviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MetricsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
