import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiquizComponent } from './aiquiz.component';

describe('AiquizComponent', () => {
  let component: AiquizComponent;
  let fixture: ComponentFixture<AiquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiquizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
