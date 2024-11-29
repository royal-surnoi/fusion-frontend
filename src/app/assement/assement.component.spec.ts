import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssementComponent } from './assement.component';

describe('AssementComponent', () => {
  let component: AssementComponent;
  let fixture: ComponentFixture<AssementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
