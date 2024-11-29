import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectupdatementorComponent } from './projectupdatementor.component';

describe('ProjectupdatementorComponent', () => {
  let component: ProjectupdatementorComponent;
  let fixture: ComponentFixture<ProjectupdatementorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectupdatementorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectupdatementorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
