import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubregisterComponent } from './subregister.component';

describe('SubregisterComponent', () => {
  let component: SubregisterComponent;
  let fixture: ComponentFixture<SubregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubregisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
