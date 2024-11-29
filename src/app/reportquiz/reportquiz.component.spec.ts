import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportquizComponent } from './reportquiz.component';

describe('ReportquizComponent', () => {
  let component: ReportquizComponent;
  let fixture: ComponentFixture<ReportquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportquizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
