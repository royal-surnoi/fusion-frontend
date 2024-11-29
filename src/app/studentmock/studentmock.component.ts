import { Component, OnInit } from '@angular/core';
// import { MockTestService } from '../mock-test.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MockTestService } from '../mocktest.service';
 
export interface MockTestInterview {
  id: number;
  title: string;
  mock_id:any;
  description: string;
  courseId: number;
  fee: number;
  freeAttempts: number;
  testType: string;
  image: string;
  enrollmentStatus?: { isEnrolled: boolean; isCompleted: boolean };
}
 
@Component({
  selector: 'app-studentmock',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './studentmock.component.html',
  styleUrls: ['./studentmock.component.css']
})
export class StudentmockComponent implements OnInit {
  showMockCards: boolean = false;
  mockTests: MockTestInterview[] = [];
  userId: number = 2; // Replace with actual userId value
  courseId: number = 2; // Replace with actual courseId value
 
  constructor(
    private mockTestService: MockTestService,
    private router: Router,
    private sanitizer: DomSanitizer // Inject DomSanitizer here
  ) {}
 
  ngOnInit(): void {
    this.loadMockTests();
  }
 
  image(toolImage: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,${toolImage}`);
  }
 
  loadMockTests(): void {
    this.mockTestService.getMockTests().subscribe(
      (data: MockTestInterview[]) => {
        console.log('Mock tests data:', data);
        this.mockTests = data;
      },
      error => {
        console.error('Error fetching mock tests', error);
        alert('Failed to load mock tests. Please try again later.');
      }
    );
  }
  viewDetails(testId: any): void {
    console.log('viewDetails called with testId:', testId);
    console.log('UserId:', this.userId);
    console.log('CourseId:', this.courseId);
 
    // Find the selected test from the local list
    const selectedTest = this.mockTests.find(test => test.mock_id === testId);
    console.log('Selected Test:', selectedTest);
 
    if (selectedTest) {
        if (this.userId && this.courseId && testId) {
            this.mockTestService.getMockStatus(this.userId, this.courseId, testId).subscribe(
                (status: any) => {
                    console.log('Mock status fetched:', status);
 
                    // Check if enrollmentStatus exists in the API response
                    if (status && status.enrollmentStatus) {
                        // Update selectedTest's enrollmentStatus with the fetched data
                        selectedTest.enrollmentStatus = status.enrollmentStatus;
 
                        // Log the updated selectedTest to check if the enrollmentStatus is set correctly
                        console.log('Updated Selected Test:', selectedTest);
 
                        // Check if the enrollment status meets the required conditions
                        if (selectedTest.enrollmentStatus?.isEnrolled && selectedTest.enrollmentStatus?.isCompleted) {
                            console.log('Navigating to /slotdetails with queryParams:', {
                                userId: this.userId,
                                courseId: this.courseId,
                                mockTestInterviewId: testId
                            });
 
                            this.router.navigate(['/slotdetails'], {
                                queryParams: {
                                    userId: this.userId,
                                    courseId: this.courseId,
                                    mockTestInterviewId: testId
                                }
                            }).then(success => {
                                if (success) {
                                    console.log('Navigation succeeded');
                                } else {
                                    console.log('Navigation failed');
                                }
                            }).catch(err => {
                                console.error('Navigation error:', err);
                            });
                        } else {
                            alert('You need to be enrolled and have completed the test to view details.');
                        }
                    } else {
                        alert('Failed to fetch enrollment status.');
                    }
                },
                (error) => {
                    console.error('Error fetching mock status:', error);
                    alert('Failed to fetch mock status.');
                }
            );
        } else {
            console.error('One or more parameters are undefined:', {
                userId: this.userId,
                courseId: this.courseId,
                testId
            });
            alert('Invalid parameters provided.');
        }
    } else {
        alert('Test not found.');
    }
}
 
 
}
 
 