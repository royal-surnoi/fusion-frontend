import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZmentorsdashboardComponent } from './zmentorsdashboard.component';

describe('ZmentorsdashboardComponent', () => {
  let component: ZmentorsdashboardComponent;
  let fixture: ComponentFixture<ZmentorsdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZmentorsdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZmentorsdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
