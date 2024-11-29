import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuiznewComponent } from './quiznew.component';

describe('QuiznewComponent', () => {
  let component: QuiznewComponent;
  let fixture: ComponentFixture<QuiznewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuiznewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuiznewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
