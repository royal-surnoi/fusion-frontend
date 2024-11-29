import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LearningPageComponent, CustomCurrencyPipe } from './learning-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { NgxPaginationModule } from 'ngx-pagination';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('LearningPageComponent', () => {
  let component: LearningPageComponent;
  let fixture: ComponentFixture<LearningPageComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ProgressBarModule,
        NgxPaginationModule,
        LearningPageComponent,
        CustomCurrencyPipe
      ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustUrl: (url: string) => url,
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LearningPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch courses on init', fakeAsync(() => {
    const mockCourses = [
      {
        id: 1,
        courseTitle: 'Test Course',
        courseFee: 100,
        currency: 'USD',
        courseImage: 'base64image',
        courseTerm: 'short'
      }
    ];
    httpClientSpy.get.and.returnValue(of(mockCourses));
    
    component.ngOnInit();
    tick();

    expect(httpClientSpy.get).toHaveBeenCalled();
    expect(component['coursesSubject'].value.length).toBe(1);
  }));

  it('should filter courses based on search term', fakeAsync(() => {
    component['coursesSubject'].next([
      { courseTitle: 'Angular Course' },
      { courseTitle: 'React Course' }
    ] as any);

    component.searchTerm = 'Angular';
    component.searchCourses();
    tick();

    component.filteredCourses$.subscribe(courses => {
      expect(courses.length).toBe(1);
      expect(courses[0].courseTitle).toBe('Angular Course');
    });
  }));

  it('should format duration correctly', () => {
    expect(component.formatDuration(60)).toBe('1 hour');
    expect(component.formatDuration(90)).toBe('1 hour 30 mins');
    expect(component.formatDuration(30)).toBe('30 mins');
  });

  it('should generate correct star arrays', () => {
    expect(component.generateStarsArray(3).length).toBe(3);
    expect(component.generateEmptyStarsArray(3).length).toBe(2);
    expect(component.generateEmptyStarsArrayonly().length).toBe(5);
  });

  it('should navigate to instructor profile', () => {
    const mockUser = { id: 123, name: 'John Doe' };
    component.onInstructorSelect(mockUser);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/usersprofile', 123]);
  });

  it('should handle error when user object is undefined', () => {
    spyOn(console, 'error');
    component.onInstructorSelect(undefined);
    expect(console.error).toHaveBeenCalledWith('User object or user ID is undefined');
  });

  it('should sanitize image URL', () => {
    const sanitizedUrl = component.image('testImage');
    expect(sanitizedUrl).toBe('data:image/png;base64,testImage');
  });
});

describe('CustomCurrencyPipe', () => {
  const pipe = new CustomCurrencyPipe();

  it('should transform USD correctly', () => {
    expect(pipe.transform(100, 'USD')).toBe('$100');
  });

  it('should transform INR correctly', () => {
    expect(pipe.transform(100, 'INR')).toBe('₹100');
  });

  it('should transform EURO correctly', () => {
    expect(pipe.transform(100, 'EURO')).toBe('€100');
  });

  it('should return original value for unknown currency', () => {
    expect(pipe.transform(100, 'GBP')).toBe('100');
  });
});