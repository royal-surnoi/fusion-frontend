import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentnewComponent } from './assignmentnew.component';

describe('AssignmentnewComponent', () => {
  let component: AssignmentnewComponent;
  let fixture: ComponentFixture<AssignmentnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentnewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
