import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuestionAttempt {
  question: Question;
  userAnswer: number | null;
}
@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  questions: Question[] = [
    {
      text: 'Which of the following is a paragraph element in HTML?',
      options: [
        '<p>You progress, the nation follows.</p>',
        '<h1>You progress, the nation follows.</h1>',
        '<body>You progress, the nation follows.</body>',
        '<button>You progress, the nation follows.</button>'
      ],
      correctAnswer: 0
    },
    {
      text: 'What does CSS stand for?',
      options: [
        'Computer Style Sheets',
        'Creative Style Sheets',
        'Cascading Style Sheets',
        'Colorful Style Sheets'
      ],
      correctAnswer: 2
    },
    {
      text: 'Which HTML tag is used to define an unordered list?',
      options: ['<ol>', '<li>', '<ul>', '<list>'],
      correctAnswer: 2
    },
    {
      text: 'What is the correct HTML element for inserting a line break?',
      options: ['<break>', '<lb>', '<br>', '<newline>'],
      correctAnswer: 2
    },
    {
      text: 'Which property is used to change the background color?',
      options: ['color', 'bgcolor', 'background-color', 'background'],
      correctAnswer: 2
    },
    {
      text: 'How do you make a list that lists its items with squares?',
      options: [
        'list-style-type: square;',
        'list: square;',
        'list-type: square;',
        'list-style: square;'
      ],
      correctAnswer: 0
    },
    {
      text: 'Which HTML attribute specifies an alternate text for an image?',
      options: ['title', 'alt', 'src', 'longdesc'],
      correctAnswer: 1
    },
    {
      text: 'How do you select an element with id "demo"?',
      options: ['demo', '.demo', '*demo', '#demo'],
      correctAnswer: 3
    },
    {
      text: 'What is the correct HTML for creating a hyperlink?',
      options: [
        '<a url="http://www.example.com">Example</a>',
        '<a href="http://www.example.com">Example</a>',
        '<a>http://www.example.com</a>',
        '<a name="http://www.example.com">Example</a>'
      ],
      correctAnswer: 1
    },
    {
      text: 'Which CSS property controls the text size?',
      options: ['font-size', 'text-size', 'text-style', 'font-style'],
      correctAnswer: 0
    }
  ];

  currentQuestionIndex = 0;
  score = 0;
  quizCompleted = false;
  selectedAnswer: number | null = null;
  answerSubmitted = false;
  correctAnswers = 0;
  wrongAnswers = 0;
  unanswered = 0;
  passScore = 60;

  questionAttempts: QuestionAttempt[] = [];
  reviewingResults = false;

  ngOnInit() {
    this.questionAttempts = this.questions.map(q => ({ question: q, userAnswer: null }));
  }

  selectAnswer(optionIndex: number) {
    if (!this.answerSubmitted) {
      this.selectedAnswer = optionIndex;
    }
  }

  submitAnswer() {
    if (this.selectedAnswer !== null && !this.answerSubmitted) {
      this.answerSubmitted = true;
      const currentQuestion = this.questions[this.currentQuestionIndex];
      this.questionAttempts[this.currentQuestionIndex].userAnswer = this.selectedAnswer;

      if (this.selectedAnswer === currentQuestion.correctAnswer) {
        this.score++;
        this.correctAnswers++;
      } else {
        this.score--;
        this.wrongAnswers++;
      }
    }
  }

  nextQuestion() {
    this.answerSubmitted = false;
    this.selectedAnswer = null;
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.quizCompleted = true;
      this.unanswered = this.questions.length - (this.correctAnswers + this.wrongAnswers);
    }
  }

  skipQuestion() {
    this.unanswered++;
    this.questionAttempts[this.currentQuestionIndex].userAnswer = null;
    this.nextQuestion();
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.quizCompleted = false;
    this.selectedAnswer = null;
    this.answerSubmitted = false;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.unanswered = 0;
    this.questionAttempts = this.questions.map(q => ({ question: q, userAnswer: null }));
    this.reviewingResults = false;
  }

  getOptionClass(index: number): string {
    if (!this.answerSubmitted) {
      return this.selectedAnswer === index ? 'selected' : '';
    }
    if (index === this.questions[this.currentQuestionIndex].correctAnswer) {
      return 'correct';
    }
    if (index === this.selectedAnswer) {
      return 'incorrect';
    }
    return '';
  }

  getFinalScorePercentage(): number {
    return Math.round((this.score / this.questions.length) * 100);
  }

  hasPassed(): boolean {
    return this.getFinalScorePercentage() >= this.passScore;
  }

  reviewResults() {
    this.quizCompleted = false;
    this.reviewingResults = true;
  }

  finishReview() {
    this.reviewingResults = false;
    this.quizCompleted = true;
  }

  getReviewOptionClass(questionIndex: number, optionIndex: number): string {
    const attempt = this.questionAttempts[questionIndex];
    if (optionIndex === attempt.question.correctAnswer) {
      return 'correct';
    }
    if (optionIndex === attempt.userAnswer && optionIndex !== attempt.question.correctAnswer) {
      return 'incorrect';
    }
    return '';
  }

  getAnswerStatus(questionIndex: number): 'correct' | 'incorrect' | 'skipped' {
    const attempt = this.questionAttempts[questionIndex];
    if (attempt.userAnswer === null) {
      return 'skipped';
    }
    return attempt.userAnswer === attempt.question.correctAnswer ? 'correct' : 'incorrect';
  }
}