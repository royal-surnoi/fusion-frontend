import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersprofileComponent } from './usersprofile.component';

describe('UsersprofileComponent', () => {
  let component: UsersprofileComponent;
  let fixture: ComponentFixture<UsersprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
