import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AIQuiz, CourseService } from '../course.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aiquiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aiquiz.component.html',
  styleUrl: './aiquiz.component.css'
})
export class AiquizComponent implements OnInit{
  
  response: any;
 
  quizzes: AIQuiz[] = [];
  quizQuestions: any[] = [];
  currentQuestionIndex: number = 0;
  selectedOption: string = '';
  quizCompleted: boolean = false;
  score: number = 0;
  userAnswers: string[] = []; // Array to hold user's answers
  quizid: any;
  quizResult: any;
  generatequiz: boolean = true;
  generatedquizStart: boolean = false;
  generatedquizStartButton: boolean = false;
  quizform: boolean = true;


  NoQuizzesPopup: boolean = false;
  NoQuizQuestionsPopup: boolean = false;

  isLoading: boolean = false;



  requestBody = {
    user_id: 0,
    course_id: 0,
    lesson_id: 0
  };
 
  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.requestBody.user_id = Number(params['userId']);
      this.requestBody.course_id = Number(params['courseId']);
      this.requestBody.lesson_id = Number(params['lessonId']);
      console.log('Quiz paramters are loaded successful', this.requestBody);

    });
  }
 
  generateQuiz() {
    this.isLoading = true;
    this.courseService.generateQuiz(this.requestBody).subscribe(
      data => {
        this.response = data;
        console.log('Quiz generating successful', data);

        // After generating the quiz, fetch the quizzes
        const userId = this.requestBody.user_id;
        const lessonId = this.requestBody.lesson_id;
        setTimeout(() => this.getQuizzes(userId, lessonId), 5000);
        setTimeout(() => this.generatequiz = false, 5000);
        setTimeout(() => this.generatedquizStart = true, 5000);
        setTimeout(() => this.generatedquizStartButton = true, 5000);
        this.isLoading = false;
      },
      error => {
        console.error('There was an error!', error);
        this.isLoading = false;
      }
    );
  }
 
  getQuizzes(userId: number, lessonId: number) {
    this.courseService.getQuizzesByUserAndLesson(userId, lessonId).subscribe(
      data => {
        this.quizzes = data;
        console.log('Getting quizzes successful', data);
      },
      error => {
        console.error('Error fetching quizzes!', error);
        this.NoQuizzesPopup = true;
      }
    );
  }
 
  loadQuizQuestions(aiQuizId: number) {
    this.quizid = aiQuizId;
    this.courseService.getQuizQuestions(aiQuizId).subscribe(
      data => {
        this.quizQuestions = data;
        console.log('Get quiz questions successful', data);
      },
      error => {
        console.error('Error getting quiz questions', error);
        this.NoQuizQuestionsPopup = true;
      }
    );
    this.generatedquizStartButton = false;
  }
 
 
  submitQuiz() {
    if (this.quizid === null) {
      console.error('Quiz ID is not set');
      return;
    }

    const userId = this.requestBody.user_id;
    
    // Prepare the answers array
    const answers = this.quizQuestions.map(question => ({
      aiQuizQuestion: { id: question.id },
      AIQuizUserAnswer: this.userAnswers[question.id] || ''
    }));

    this.courseService.submitAIQuizAnswers(this.quizid, userId, answers).subscribe(
      response => {
        console.log('Quiz submitted successfully!', response);
        this.quizCompleted = true;
        // Handle success - Show success message, redirect, etc.
      },
      error => {
        console.error('Error submitting quiz:', error);
        // Handle error - Show error message, etc.
      }
    );
    setTimeout(() => this.getQuizResult(),5000);
  }
  getQuizResult(): void {
    const userId = this.requestBody.user_id
    this.courseService.getQuizResult(this.quizid, userId).subscribe(
      (result) => {
        this.quizResult = result;
        console.log('AI quiz result getting successful',result); // Debugging purpose, can be removed
      },
      (error) => {
        console.error('Error fetching quiz result:', error);
      }
    );
    this.quizform = false;
  }
  getValidOptions(question: any): string[] {
    return [question.aioption1, question.aioption2, question.aioption3, question.aioption4]
      .filter(option => option !== null && option !== undefined && option !== '');
  }

}
