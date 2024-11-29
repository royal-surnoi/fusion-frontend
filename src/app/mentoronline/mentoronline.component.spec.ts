import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentoronlineComponent } from './mentoronline.component';

describe('MentoronlineComponent', () => {
  let component: MentoronlineComponent;
  let fixture: ComponentFixture<MentoronlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentoronlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentoronlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
