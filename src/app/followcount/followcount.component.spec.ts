import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowcountComponent } from './followcount.component';

describe('FollowcountComponent', () => {
  let component: FollowcountComponent;
  let fixture: ComponentFixture<FollowcountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowcountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
