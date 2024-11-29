import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveItemsComponent } from './save-items.component';

describe('SaveItemsComponent', () => {
  let component: SaveItemsComponent;
  let fixture: ComponentFixture<SaveItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
