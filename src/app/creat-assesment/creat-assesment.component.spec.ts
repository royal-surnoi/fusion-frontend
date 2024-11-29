import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatAssesmentComponent } from './creat-assesment.component';

describe('CreatAssesmentComponent', () => {
  let component: CreatAssesmentComponent;
  let fixture: ComponentFixture<CreatAssesmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatAssesmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
