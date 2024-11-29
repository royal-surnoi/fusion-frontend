import { Injectable } from '@angular/core';
import { Observable,of  } from 'rxjs';
import { delay, } from 'rxjs/operators';
interface Activity {
  id: number;
  name: string;
  type: 'quiz' | 'assignment' | 'project';
  content: any;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private sampleActivities: Activity[] = [
    {
      id: 1,
      name: 'Web Development Basics Quiz',
      type: 'quiz',
      content: {
        questions: [
          {
            id: 1,
            text: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'High Tech Multi Language', 'Hyper Transfer Markup Language', 'None of the above'],
            correctAnswer: 0
          },
          {
            id: 2,
            text: 'Which of the following is used for styling web pages?',
            options: ['HTML', 'JavaScript', 'CSS', 'XML'],
            correctAnswer: 2
          },
          {
            id: 3,
            text: 'What is the purpose of JavaScript in web development?',
            options: ['To style the webpage', 'To create the structure of the webpage', 'To add interactivity to the webpage', 'To handle server-side logic'],
            correctAnswer: 2
          }
        ]
      }
    },
    {
      id: 2,
      name: 'CSS Layout Assignment',
      type: 'assignment',
      content: {
        description: 'Create a responsive layout using CSS Grid and Flexbox. Your layout should include a header, footer, main content area, and a sidebar.',
        requirements: [
          'Use CSS Grid for the overall page layout',
          'Use Flexbox for aligning items within grid areas',
          'Make the layout responsive for mobile, tablet, and desktop views',
          'Include at least one media query',
          'Use semantic HTML5 elements'
        ],
        submissionFormat: 'Submit a GitHub repository link containing your HTML and CSS files.'
      }
    },
    {
      id: 3,
      name: 'JavaScript Calculator Project',
      type: 'project',
      content: {
        description: 'Build a functional calculator using HTML, CSS, and JavaScript.',
        requirements: [
          'Implement basic arithmetic operations (addition, subtraction, multiplication, division)',
          'Include a clear button to reset the calculator',
          'Handle decimal numbers',
          'Implement keyboard support for number input and operations',
          'Style your calculator to look visually appealing'
        ],
        submissionFormat: 'Submit a GitHub repository link containing your project files and a README with instructions on how to run the calculator.'
      }
    }
  ];
 

 
  getActivitiesForCandidate(activityId: number){
    // const activity = this.sampleActivities.find(a => a.id === activityId);
    // if (!activity) {
       
    //     throw new Error(`Activity with id ${activityId} not found`);
    // }
    // return of(activity).pipe(delay(500));
    return this.sampleActivities
  }
 
  submitActivity(activityId: number, data: any): Observable<any> {
    // Simulate a submission response
    const response = {
      success: true,
      message: 'Activity submitted successfully',
      submissionId: Math.floor(Math.random() * 1000000), // Generate a random submission ID
      activityId: activityId,
      submittedAt: new Date().toISOString()
    };
    return of(response).pipe(delay(1000)); // Simulate network delay
  }



  
}