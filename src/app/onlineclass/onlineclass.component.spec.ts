import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineclassComponent } from './onlineclass.component';

describe('OnlineclassComponent', () => {
  let component: OnlineclassComponent;
  let fixture: ComponentFixture<OnlineclassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineclassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineclassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
