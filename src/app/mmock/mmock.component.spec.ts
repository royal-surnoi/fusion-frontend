import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmockComponent } from './mmock.component';

describe('MmockComponent', () => {
  let component: MmockComponent;
  let fixture: ComponentFixture<MmockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MmockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MmockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
