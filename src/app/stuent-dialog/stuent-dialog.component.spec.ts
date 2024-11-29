import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StuentDialogComponent } from './stuent-dialog.component';

describe('StuentDialogComponent', () => {
  let component: StuentDialogComponent;
  let fixture: ComponentFixture<StuentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StuentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StuentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
