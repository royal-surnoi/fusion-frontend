import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
 
interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}
 
interface QuizData {
  id: number;
  name: string;
  questions: QuizQuestion[];
}

@Component({
  selector: 'app-quiznew',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './quiznew.component.html',
  styleUrl: './quiznew.component.css'
})
export class QuiznewComponent implements OnInit {
  @Input() quizData: any;
  @Output() dataUpdate = new EventEmitter<any>();
 
  userAnswers: number[] = [];
  quizSubmitted: boolean = false;
  score: number = 0;
  quizDatas: any;
  AssigmentDetails: any;
 constructor(private http:HttpClient){

 }
  ngOnInit() {
    if (this.quizData) {
      this.userAnswers = new Array(this.quizData.questions.length).fill(-1);
    }
  }
 
  isQuizComplete(): boolean {
    return this.userAnswers.every(answer => answer !== -1);
  }
 
  submitQuiz() {
    if (!this.isQuizComplete()) {
      alert('Please answer all questions before submitting.');
      return;
    }
 
    this.score = this.calculateScore();
    this.quizSubmitted = true;
 
    // Emit the quiz results to the parent component
    this.dataUpdate.emit({
      quizId: this.quizData.id,
      userAnswers: this.userAnswers,
      score: this.score
    });
  }
 
  calculateScore(): number {
    return this.quizData.questions.reduce((score:any, question:any, index:any) => {
      return score + (question.correctAnswer === this.userAnswers[index] ? 1 : 0);
    }, 0);
   
  }
 
  getQuizBycourseId(){
      this.http.get(`${environment.apiBaseUrl}/api/quizzes/course/${1}/withQuestions`).subscribe((res)=>{
        console.log(res)
        this.quizDatas = res
      })
  }
  getAssignmentbuCourseId(){
    this.http.get(`${environment.apiBaseUrl}/api/assignments/course/1`).subscribe((res)=>{
      console.log(res)
      this.AssigmentDetails = res
    })
  }
}
