
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
 
 
interface image{
  src:string
}
interface short {
  title: string;
  description: string;
  fileUrl: string;
}
 
interface Announcement {
 
  content: string;
  date: Date; // Add a date property
 
}
interface Course {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
}
interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
}
 
interface Announcement {
  content: string;
  date: Date;
}
 
 
 
 
@Component({
  selector: 'app-mentordashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './mentordashboard.component.html',
  styleUrl: './mentordashboard.component.css'
})
 
 
export class MentordashboardComponent {
 
 
  name: string = 'Shivakumar';
  Id: string = '77';
  number: string = '9885521047';
  currentTab: string = 'Dashboard';
  imageUrl: string = 'assets/surya.jpg';
  showPopup: boolean = false;
  cards: any[] = [];
  courses: Course[] = [];
  showCards: boolean = false;
  showAddCourse: boolean = false; // Initially false to hide the Add Course section
  currentSlide: number = 1; // Tracks the current slide in the Add Course section
  // courses:any;
  showAddQuiz: boolean = false; // New property to manage quiz section visibility
  showAddMockTest: boolean = false; // New property to manage mock interview section visibility
 
  quizQuestions: QuizQuestion[] = [
    {
      question: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0
    }
  ];
  addQuestion(): void {
    this.quizQuestions.push({
      question: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0
    });
  }
  removeQuestion(index: number): void {
    this.quizQuestions.splice(index, 1);
  }
 
  courseData = {
    courseTitle: '',
    prerequisites: [''],
    skills: [''],
    tools: [{ name: '', image: null }],
    learningPoints: [''],
    moduleTitle: '',
    moduleDescription: '',
    testNominals: '',
    coursePrice: '',
    discount: ''
  };
 
 
shorts: short[] = [
    { title: 'Useful iPhone Feature', description: 'Create a useful feature on iPhone', fileUrl: 'assets/1shot.mp4'},// Ensure the filename is URL safe
    { title: 'Useful iPhone Feature', description: 'Create a useful feature on iPhone', fileUrl: 'assets/1shot.mp4'},// Ensure the filename is URL safe
    { title: 'Useful iPhone Feature', description: 'Create a useful feature on iPhone', fileUrl: 'assets/1shot.mp4'},// Ensure the filename is URL safe
    { title: 'Useful iPhone Feature', description: 'Create a useful feature on iPhone', fileUrl: 'assets/1shot.mp4'},// Ensure the filename is URL safe
    ];
 
  displayedshorts: short[] = [];
  shortsPerPage: number = 6;
  currentPage: number = 1;
  hasMoreshorts: boolean = true;
 
  newshort: short = {
    title: '',
    description: '',
    fileUrl: ''
  };
  selectedFile: File | null = null;
 
  constructor(private http: HttpClient) {}
 
  ngOnInit(): void {
    this.getshorts();
    this.loadCourses();
  }
 
 
  setCurrentTab(tab: string) {
    console.log('Switching to tab:', tab);
    this.currentTab = tab;
  }
  loadCourses() {
    // Simulate a HTTP call to fetch courses
    this.courses = [
      { title: 'Java Fullstack Developer', 
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 
        imageUrl: '../../assets/java-training.jpg', 
        buttonText: 'View Course' 
      },
      { title: 'Java Fullstack Developer', 
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 
        imageUrl: '../../assets/java-training.jpg', 
        buttonText: 'View Course' 
      }
    ];
  }
  toggleAddCourse() {
    this.showAddCourse = !this.showAddCourse;
    this.showAddQuiz = false; // Ensure quiz section is hidden when switching to course section
        this.showAddMockTest = false; // Ensure mock interview section is hidden when switching to course section
 
 
  }
  toggleAddMockTest() {
    this.showAddMockTest = !this.showAddMockTest;
    this.showAddCourse = false;
    this.showAddQuiz = false; // Ensure course and quiz sections are hidden when switching to mock interview section
  }
 
  toggleAddQuiz() {
    this.showAddQuiz = !this.showAddQuiz;
    this.showAddCourse = false; // Ensure course section is hidden when switching to quiz section
  }
  togglePopup() {
    this.showPopup = !this.showPopup;
  }
 
  submitQuiz(): void {
    console.log('Quiz submitted:', this.quizQuestions);
    // Implement further logic here, e.g., send data to backend
  }
 
  isValidCorrectOptionIndex(index: number): boolean {
    // Validate correct option index to be between 1 and 4
    return index >= 1 && index <= 4;
  }
  getTotalQuestions(): number {
    return this.quizQuestions.length;
  }
 
 
 
  nextSlide() {
    if (this.currentSlide < 3) {
      this.currentSlide++;
    }
  }
 
  prevSlide() {
    if (this.currentSlide > 1) {
      this.currentSlide--;
    }
  }
 
  addPrerequisite() {
    this.courseData.prerequisites.push('');
  }
  deletePrerequisite(index: number) {
    this.courseData.prerequisites.splice(index, 1);
  }
  addSkill() {
    this.courseData.skills.push('');
  }
 
  deleteSkill(index: number) {
    this.courseData.skills.splice(index, 1);
  }
  addTool() {
    this.courseData.tools.push({ name: '', image: null });
  }
 
  deleteTool(index: number) {
    this.courseData.tools.splice(index, 1);
  }
 
  onToolImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    this.courseData.tools[index].image = file;
  }
 
  addLearningPoint() {
    this.courseData.learningPoints.push('');
  }
 
  deleteLearningPoint(index: number) {
    this.courseData.learningPoints.splice(index, 1);
  }
 
  logCourseData() {
    console.log(this.courseData);
    // Logic to save the course data can be added here
  }
  toggleCards() {
    this.showCards = !this.showCards;
    this.showAddCourse = false; // Hide the Add Course section after saving
    this.showAddQuiz = false; // Ensure course and quiz sections are hidden when switching to mock interview section
    this.showAddMockTest= false;
 
 
 
  }
 
 
  saveCourse() {
    // Logic to save course details
    console.log('Course saved!');
    // Reset slide after saving
    this.currentSlide = 1;
    this.showAddCourse = false; // Hide the Add Course section after saving
  }
  addItem() {
    this.showAddCourse = true; // Show the Add Course section when the button is clicked
  }
 
 
 
 
 
  // Initialize your data
  announcements: Announcement[] = [
    { content: 'We have launched a new course on Advanced Java Programming.', date: new Date() }
  ];
 
  newAnnouncement: Announcement = {
    content: '',
    date: new Date()
  };
 
   // Method to add a new announcement
   addAnnouncement(event: Event) {
    event.preventDefault();
    if (this.newAnnouncement.content) {
      this.announcements.unshift({ ...this.newAnnouncement });
      this.newAnnouncement.content = ''; // Clear the content field
      this.newAnnouncement.date = new Date(); // Update the date to current time
    }
  }
 
 
 onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
 
  addshort(event: Event): void {
    event.preventDefault();
    if (this.newshort.title && this.newshort.description && this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.newshort.title);
      formData.append('description', this.newshort.description);
      formData.append('file', this.selectedFile);
 
      this.http.post<short>('http://your-api-endpoint.com/shorts', formData)
        .subscribe(response => {
          this.shorts.unshift(response);
          this.updateDisplayedshorts();
          this.newshort.title = '';
          this.newshort.description = '';
          this.newshort.fileUrl = '';
          this.selectedFile = null;
        }, error => {
          console.error('Error uploading short:', error);
        });
    }
  }
 
  getshorts(): void {
    this.http.get<short[]>('http://your-api-endpoint.com/shorts')
      .subscribe(response => {
        this.shorts = response;
        this.updateDisplayedshorts();
      }, error => {
        console.error('Error fetching shorts:', error);
      });
  }
 
  onVideoPlay(event: Event): void {
    const currentVideo = event.target as HTMLVideoElement;
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (video !== currentVideo) {
        video.pause();
      }
    });
  }
 
  updateDisplayedshorts(): void {
    const startIndex = (this.currentPage - 1) * this.shortsPerPage;
    const endIndex = this.currentPage * this.shortsPerPage;
    this.displayedshorts = this.shorts.slice(0, endIndex);
    this.hasMoreshorts = this.shorts.length > endIndex;
  }
 
  loadMoreshorts(): void {
    this.currentPage++;
    this.updateDisplayedshorts();
  }
 
 
 
 
 
 
}
 