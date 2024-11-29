import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenotperspectveComponent } from './menotperspectve.component';

describe('MenotperspectveComponent', () => {
  let component: MenotperspectveComponent;
  let fixture: ComponentFixture<MenotperspectveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenotperspectveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenotperspectveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
