 
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
 
import { FusionService } from '../fusion.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject, Observable, catchError, forkJoin, map, of, tap } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService,User } from '../user.service';
import { AuthService } from '../auth.service';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import { environment } from '../../environments/environment';
 
declare var bootstrap: any; // Declare bootstrap variable to avoid TypeScript errors
//  error prasna
// export interface User {
//   userImage: string;
//   profileImage: string | SafeUrl; // Adjusted to accept SafeUrl
 
//     id: number;
//     name: string;
// }
interface Reply {
  id: number;
  liked: boolean;
  likes: number;
}
interface NestedComment {
  id: number;
  content: string;
  user: User;
  likes: number;
  createdAt: string | Date;
}

interface CombinedPost extends Post {
  type:  'image' | 'video' | 'article';
  isVideo?: boolean;
  isImage?: boolean;
  isArticle?: boolean;
  normalizedDate?: Date;
}
interface Group {
  id: number;
  name: string;
}

interface Follower {
  id: number;
  name: string;
}
 
 
export interface Comment {
  profileImage: string | SafeUrl; // Adjusted to accept SafeUrl
  content: string;
  userImage:string;
  id: number;
  postId:number;

  likes?: number;
  liked?: boolean;
  videoCommentContent:string;
  text:string;
  user:{
    id:number;
    profileImage: string | SafeUrl; // Adjusted to accept SafeUrl
    userImage: string;
    profession:string;
    name: string;
 
  }
  
  commentDate:string;
    timestamp:Date;
  createdAt: string;
  replies?:Comment[];
}
export interface Video {
  id: number;
  src: string;
  likes: number;
  comments: string[];
  shortVideoLikes: number;
  shortVideoShares: number;
  shortVideoViews: number;
  description?: string;
  createdAt:Date;
  profileImage: string | SafeUrl; // Adjusted to accept SafeUrl

}
export interface short {
  profileImage: string | SafeUrl; // Adjusted to accept SafeUrl

} 
 
 
 
interface Post {
  url: string;
  type: 'video' | 'article' | 'image';
  id: number;
  userId: number; // Add this line

  title: string;
  src: string;
  likes: number;
  comments: string[];
  shares: number;
  content: string;
  timestamp: string;
  createdAt:string
  profileImage: string | SafeUrl; // Adjusted to accept SafeUrl
  profileName: string;
  isVideo?: boolean;
  isArticle?: boolean;
  isImage?: boolean;
  showComments?: boolean;
  liked?: boolean;
  showShareMenu?: boolean;
  saved?: boolean;
  newComment?: string;
  normalizedDate?: Date;
  views:number;

  showShareOptions?: boolean;
  showCommentBox?: boolean;
  showShareModal?: boolean;
  showFullContent?: boolean;
  text:string[];
  videoCommentContent: string[];
  commentDate:string;
  shortVideoLikes: number;
  shortVideoShares: number;
  shortVideoViews: number;
  description: string;
  uploadFailed?: boolean; // New optional property
  tag:string;

}

// interface specificPost{

// }

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('liveVideo') liveVideo!: ElementRef;
  @ViewChild('photoCanvas') photoCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('shortVideoInput') shortVideoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('shortsContainer', { read: ElementRef }) shortsContainer!: ElementRef;


  isVideo:boolean=false;
  post = { title: '', content: '', likes: 0, comments: [], liked: false };
  isPostMode:boolean=false;
  posts: Post[] = []; 
  // specificPosts: specificPost[] = [];
  newComment: string = '';
  newShortVideo: File | null = null;
  isShortVideoMode: boolean = false;
  shortVideoPreviewUrl: string | null = null;

  isPosting:boolean=false;
  showPhotoOptionsModal:boolean=false;
  shorts: any[] = [];
  reorderedShorts: any[] = [];

  selectedPostIndex: number | null = null; // Track the selected post index for sharing modal
  selectedFile: File | null = null;
  userImage: SafeUrl | null = null;
 
  images: Post[] = [];
  articles: Post[] = [];
  combinedPosts: Post[] = [];
  videos: Post[] = [];
  comments: {[shortId: number]: any[]} = {};

// ==========================================================================================
replyingTo: { [commentId: number]: boolean } = {};
  newReply: { [commentId: number]: string } = {};
  replies: { [commentId: number]: Comment[] } = {};
 
  repliesVisible: any = {}; // To track the visibility of replies
 
  openCommentId: number | null = null;

  showReplies: { [key: number]: boolean } = {}; // To keep track of the replies visibility

  replyContent: { [commentId: number]: string } = {};

  private watchedTime: number = 0;
  private hasIncrementedView: boolean = false;

  editingComment: { [commentId: number]: boolean } = {};
  editContent: { [commentId: number]: string } = {};

  editingNestedComment: { [commentId: number]: boolean } = {};
  editNestedContent: { [commentId: number]: string } = {};

// =========================================AIML=====================================================
showFullDescription: { [key: number]: boolean } = {};  // Track each post's toggle state
initialCharacterLimit = 100;  // Show 50 characters initially
readMoreCharacterLimit = 101;  // S
articleInitialCharacterLimit = 500;  // Show 500 characters initially for articles
articleReadMoreCharacterLimit = 500;
loading: boolean = false;
error: string | null = null;
private apiBaseUrl = environment.apiBaseUrl;
isLoading: boolean = false;
totalElements = 0;
totalPages = 0;
currentPage: number = 0;  
pageSize: number = 3;  
hasMorePosts: boolean = true; 
displayedPosts: any[] = [];  
// ==============================================================================


 
//  Laxmiprasanna Kondoju
 
userId!: number;
recommendations: User[] = [];
followRequests: User[] = [];
name: string | null = '';
  user: any = {};
  currentUserId: string | null = null;
  currentUserName: string | null = null;
  followerCount: any;
  followingCount: any;
  followers: any[] = [];
  following: any[] = [];
  users$ = this.userService.users$;
  currentUser = this.userService.getCurrentUser();
  followRequests$: Observable<User[]>;
  // followRequests$ = this.userService.followRequests$;
  users: User[] = [];
  private friendsSubject = new BehaviorSubject<User[]>([]);
  friends$ = this.friendsSubject.asObservable();
 
  private usersSubject = new BehaviorSubject<User[]>([]);
 
 
 
  followerCount$: Observable<number>;
  followingCount$: Observable<number>;
  followrequest: any;
  arr: any;
 
  sentFollowRequests: number[] = [];
  sentRequestUsers: any[];
  cuserId: any;
 
 
  showAllSuggestions: boolean = false;

 
 
 
//  ==========================================================================================================
 
members = [
  {
    name: 'John Smith',
    profilePic: ''
 
  },
  {
    name: 'Jane Doe',
    profilePic: ''
  },
  // Add more members as needed
];
 
suggestedConnections = [
  { name: 'Uday', img: 'assets/placeholder-image.jpg' },
  { name: 'Uday', img: 'assets/placeholder-image.jpg' },
  { name: 'Uday', img: 'assets/placeholder-image.jpg' },
  { name: 'uday', img: 'assets/placeholder-image.jpg' }
];
 
engageSuggestions = [
  ' Join the "Tech Innovators" group',
  'Participate in the "Hackathon 2024"',
  ' Attend the "Networking Night"',
  ' Follow the "AI Trends" page'
];
  upcomingEvents = [
    {
      title: 'Social Media',
      date: '18',
      month: 'June',
      location: 'hyderabad',
      moreInfoLink: '#'
    },
    {
      title: 'Deveops engg',
      date: '18',
      month: 'June',
      location: 'Madhapur',
      moreInfoLink: '#'
    },
    {
      title: 'Mobile Marketing',
      date: '22',
      month: 'June',
      location: 'hitech city',
      moreInfoLink: '#'
    }
    // Add more events as needed
  ];
 
 
 
  recentSearches: string[] = [
    'Education Technology',
    'Online Learning Platforms',
    'Educational Psychology',
    'Blended Learning Solutions',
    'E-Learning Trends',
    'Education Policy',
    'Virtual Classrooms',
    'STEM Education',
    'Language Learning Apps',
    'Personalized Learning',
    'Educational Resources',
    'Distance Learning',
    'Higher Education',
    'K-12 Education'
  ];
 
  showMore: boolean = false;
 
 
  groups: Group[] = [
    { id: 1, name: 'Finance Club' },
    { id: 2, name: 'Future Trend' },
    { id: 3, name: 'Project Manager Commun..' }
  ];
  showCreateGroupModal = false;
  newGroupName = '';
  selectedMembers: number[] = [];
  subscriptions: any;
  cdr: any;
content: string='';
  selectedPostId: any;
  showSpecificPost: any;
  showUserDetailsPopup: boolean = false;
  // selectedPostId: any;
  isLoggedIn: boolean = false;
  isloading: boolean = false;
  specificPost: any; 
 
  // followers: Follower[] = [
  //   // Populate this with your actual followers data
  // ];
 
 
 
 
  // Track whether to show additional items
 
  // Toggle function for 'View More' button
  toggleShowMore() {
    this.showMore = !this.showMore;
  }
 
 
 
 
 
 
 
 
 
  data: any;
  isCommentBoxVisible?: boolean;
  commentText: any;
  submittedComments: any;
  articalCommentCount: any;
  ArticalComment: any;
  articalComment: any;
  articalCommentret: any;
  currentComment: any;
  imageComment: any;
  videoCommentContent: any;
  getarticllike: any;
  getartcilebyid: any;
  articlLike: any;
  articleShare: any;
  vedioLike: any;
  videoId: number = 1;
  currentPost: any;
  // recommendations: any[] = [
  //   {
  //     name: 'John Doe',
  //     role: 'Software Engineer',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     role: 'Product Manager',
  //   },
  //   {
  //     name: 'Alice Johnson',
  //     role: 'Designer'
  //   },
  //   {
  //     name: 'Robert Brown',
  //     role: 'DevOps Engineer',
  //   },
  // ]; // Define type as per your backend response
 
 
 
  // formatDate(dateString: string): string {
  //   return formatDate(dateString, 'mediumDate', 'en-US');
  // }
  getFormattedTimeAgo(timestamp: string): string {
    let date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      // Handle the invalid date case
      return '';
    }
    return formatDistanceToNow(date, { addSuffix: true });
  }
 
  formatTimeAgo(timestamp: string | number | Date | number[]): string {
    if (!timestamp) return '';
 
    let date: Date;
 
    if (Array.isArray(timestamp)) {
      // If timestamp is an array, construct the Date object
      date = new Date(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3], timestamp[4], timestamp[5]);
    } else {
      // If it's a string, number, or Date object, create Date object directly
      date = new Date(timestamp);
    }
 
    return formatDistanceToNow(date, { addSuffix: true });
  }
 
 
 
 
 
  private shortsBatchSize = 3;
  isShortsFullScreen = false;
  currentShort: Video | null = null;
  allVideos: HTMLVideoElement[] = [];
  currentVideoIndex: number = 0;
  initialVisibleShorts = 3;
  currentVideoSrc: string = '';
  visibleShorts: Video[] = [];
  currentShortIndex: number = 0;
  startX: number = 0;
  selectedVideoIndex: number | null = null;
  showLiveVideo = false;
  showMediaOptions = false;
  mediaStream: MediaStream | null = null;
  showCamera = false;
  capturedImage: string | null = null;
  isArticleMode: boolean = false;
  // currentUserId: number = 1; // Replace with the actual user ID prasna
  commentCount: number = 0; // Variable to hold comment count
  fullScreenShort: any = null;
  isFullScreenView: boolean = false;
  // reorderedShorts: any[] = [];
  private observer: IntersectionObserver | null = null;
  private currentPlayingVideo: HTMLVideoElement | null = null;
 
  getIconClass(searchItem: string): string {
    const iconsMap: { [key: string]: string } = {
      'Education Technology': 'fa-graduation-cap',
      'Online Learning Platforms': 'fa-laptop',
      'Educational Psychology': 'fa-brain',
      'Blended Learning Solutions': 'fa-chalkboard-teacher',
      'E-Learning Trends': 'fa-chart-line',
      'Education Policy': 'fa-gavel',
      'Virtual Classrooms': 'fa-video',
      'STEM Education': 'fa-atom',
      'Language Learning Apps': 'fa-language',
      'Personalized Learning': 'fa-user-graduate',
      'Educational Resources': 'fa-book',
      'Distance Learning': 'fa-wifi',
      'Higher Education': 'fa-university',
      'K-12 Education': 'fa-school'
    };
 
    return iconsMap[searchItem] || 'fa-search';
  }
 
 
  // user: any; prasna
  errorMessage: string = ''
  imageUrl: string | null = null; // URL of the uploaded image
  originalImage: SafeUrl | null = null; // Store the original image URL
  newImage: SafeUrl | null = null;
 
  newPost: any = { content: '', image: null, video: null,tag:'' };
  // userId: number = 0; prasanna
  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef, private fusionService: FusionService, private sanitizer: DomSanitizer, private router: Router,private snackBar: MatSnackBar,private userService : UserService, private authService : AuthService,private route: ActivatedRoute) {
  //  prasanna
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    this.followRequests$ = this.userService.followRequests$;
    this.followerCount$ = this.userService.followerCount$;
    this.followingCount$ = this.userService.followingCount$;
    this.sentRequestUsers = [];
 
  }
 
  //prasanna
   
  getSafeImageUrl(imageData: string | null | undefined): SafeUrl | null {
    if (imageData) {
      return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${imageData}`);
    }
    return null;
  }
 
 
  ngOnInit(): void { 

    this.route.queryParams.subscribe(params => {
      
      const url = params['url'];
      if (url) {
        this.loadSpecificPost(url);
      }
    });
 
    this.route.queryParams.subscribe(params => {
      this.selectedPostId = params['postId'];
      if (this.selectedPostId) {
        this.loadSpecificPost(this.selectedPostId);
      }
    });

    this.loadAllPosts1();
this.getShorts1()
   



    console.log(this.reorderedShorts);

    this.fetchRecommendations()
    console.log('Comments:', this.comments); // Check if comments are populated
 
 this.combinedPosts = []
   
    // Fetch comments for all posts
    this.loadCommentsForAllPosts(
      
    );
    
    // Add this method to your component
   

 
    this.posts = []
    this.loadCommentsForAllPosts();
    this.fetchUserDetails();
    // ===================================================================================================
    //prasanna
    this.loadRecommendations();
    this.loadFollowRequests();
    this.fetchUserDetails();
    this.userService.fetchUsers();
    this.fetchFollowRequests();
    this.cuserId =this.authService.getId();
    this.currentUserId = this.authService.getId();
    if (this.currentUserId) {
      // Fetch user details using the current user ID
      this.getUserDetails(Number(this.currentUserId));
    } else {
      console.error('No user is currently logged in');
    }
 
    this.subscriptions.add(
      this.authService.getNameObservable().subscribe(name => {
        this.name = name;
      })
    );
 
    this.subscriptions.add(
      this.userService.users$.subscribe(users => {
        this.users = users;
      })
    );
 
    this.subscriptions.add(
      this.authService.getNameObservable().subscribe(id => {
        this.currentUserId = id;
        // this.fetchFollowerAndFollowingCounts();
      })
    );
    this.userService.followRequests$.subscribe(requests => {
      console.log('Follow requests updated:', requests);
     
    });
    this.userService.users$.subscribe(users => {
      // Process users to include profile images
      this.users$ = of(users.map(user => ({
        ...user,
        userImage: user.userImage || null // Ensure userImage is set, even if null
      })));
    });
 
    this.followRequests$ = this.userService.followRequests$.pipe(
      map(requests => requests.map(request => ({
        ...request,
        userImage: request.userImage || null
      })))
    );
   }
 
 
//  ==================================================================================================
formatViewCount(viewCount: number): string {
  if (viewCount >= 1_000_000) {
    return `${(viewCount / 1_000_000).toFixed(1)}M`;
  } else if (viewCount >= 1_000) {
    return `${(viewCount / 1_000).toFixed(1)}K`;
  } else {
    return `${viewCount}`;
  }
}

onVideoView2(shortId: number): void {
  console.log(`Calling onVideoView2 for shortId: ${shortId} at ${this.watchedTime.toFixed(2)} seconds`);
  this.fusionService.incrementViewCount2(shortId).subscribe({
    next: () => console.log(`Successfully incremented view count for video ID: ${shortId}`),
    error: (err) => console.error(`Failed to increment view count for video ID: ${shortId}`, err)
  });
}

onVideoViewed(postId: number): void {
  console.log(`Calling onVideoViewed for postId: ${postId} at ${this.watchedTime.toFixed(2)} seconds`);
  this.fusionService.incrementViewCount(postId).subscribe({
    next: () => {
      console.log('View count incremented successfully');
    },
    error: (err) => {
      console.error('Error incrementing view count', err);
    }
  });
}



scrollLeft() {
  this.shortsContainer.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
}

scrollRight() {
  this.shortsContainer.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
}













  
private parseDate(dateString: string): Date {
  if (!dateString) return new Date(0);
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? new Date(0) : parsedDate;
}
 loadRecommendations() {
    this.userService.users$.subscribe(users => {
      this.recommendations = users;
    });
  }
  loadFollowRequests() {
    this.userService.followRequests$.subscribe(requests => {
      this.followRequests = requests;
    });
  }
  async followUser(userId: number): Promise<void> {
    try {
      await this.userService.followUser(userId).toPromise();
      console.log('Follow request sent successfully');
      // await this.fetchSentFollowRequests();
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error sending follow request', error);
    }
  }
  viewMoreSuggestions(): void {
    const currentUserId = this.authService.getId();
    this.router.navigate(['/profile',currentUserId], {
      queryParams: {
        section: 'connections',
        activeTab: 'suggestions'
      }
    });
  }
 
 
 
  async acceptFollowRequest(userId: number): Promise<void> {
    try {
      await this.userService.incrementCounts(userId, this.cuserId).toPromise();
      console.log('Follow request accepted');
      this.userService.removeFollowRequestFromList(userId);
      // await this.fetchFollowers();
      // await this.updateCounts();
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error accepting follow request', error);
    }
  }
 
  
 
  ignoreFollowRequest(userId: number) {
    this.userService.ignoreFollowRequest(userId).subscribe({
      next: () => {
        console.log('Follow request ignored successfully');
        this.fetchFollowRequests(); // Reload the follow requests
      },
      error: (error) => {
        console.error('Error ignoring follow request:', error);
        // Handle error (e.g., show an error message to the user)
      }
    });
  }
 
  async cancelFollowRequest(userId: number): Promise<void> {
    try {
      await this.userService.cancelFollowRequest(userId).toPromise();
      console.log('Follow request cancelled successfully');
      // await this.fetchSentFollowRequests();
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error cancelling follow request', error);
    }
  }
  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      user => {
        this.user = user;
        console.log('User details:', this.user);
        // this.fetchFollowerAndFollowingCounts(userId);
      },
      error => console.error('Error fetching user details:', error)
    );
  }
  getUserNameById(userId: number): Observable<User> {

    return this.http.get<User>(`http://34.230.34.88:8080/user/find/${userId}`).pipe(

    // return this.http.get<User>(`http://34.230.34.88:8080/user/find/${userId}`).pipe(

      catchError(error => {
        console.error('Error fetching user details', error);
        return of({ id: userId, name: 'Unknown User' } as User);
      })
    );
  }
 
  loadCommentsForAllPosts(): void {
    this.combinedPosts.forEach(post => {
      this.fetchComments(post.type, post.id);
      
    });
  }
  fetchFollowRequests(): void {
    const currentUserId = this.authService.getId();
    if (currentUserId) {
      this.userService.fetchFollowRequests(Number(currentUserId)).subscribe(
        requests => {
          console.log('Fetched follow requests:', requests);
          this.followRequests = requests;
          this.cdr.markForCheck();
        },
        error => console.error('Error fetching follow requests:', error)
      );
    }
  }
  
  setCurrentUser(user: { id: number; name: string; followers: number; following: number }): void {
    this.currentUser = user;
    console.log('Current user set to:', this.currentUser);
    // this.fetchFriends();
 
  }
 
 
  fetchRecommendations() {
    this.fusionService.fetchRecommendations().subscribe(
      (data) => {
        this.recommendations = data; // Assuming data is an array of recommendations
      },
      (error) => {
        console.error('Error fetching recommendations:', error);
        // Handle error gracefully
      }
    );
  }
 
  fetchUserDetails(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.fusionService.getUserById(userId).subscribe({
        next: (data) => {
          this.user = data;
          this.userId = data.id;
           // Set userId based on fetched user data
 
          // Create SafeUrl for user image
          if (data.userImage) {
            this.userImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data.userImage}`);
            this.originalImage = this.userImage; // Set original image
 
          }
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
        }
      });
    } else {
      console.error('User ID not found in local storage');
    }
  }
 
 
//  ===============================================================================================================
// sram
  showImagePreview(): void {
    if (confirm("Do you want to upload this image?")) {
      if (this.selectedFile) {
        this.uploadProfileImage(this.selectedFile);
      } else {
        console.error('No file selected');
      }
    } else {
      this.revertImage();
    }
  }
 
  revertImage(): void {
    this.userImage = this.originalImage; // Revert to the original image
    this.newImage = null;
    this.selectedFile = null; // Clear the selected file
  }
 
  uploadProfileImage(file: File): void {
    if (file && this.userId) {
      this.fusionService.uploadUserImage(this.userId, file).subscribe(
        (response) => {
          console.log(response); // Handle success
          this.fetchUserDetails(); // Refresh the profile image after upload
 
        },
        (error) => {
          console.error(error); // Handle error
        }
      );
    } else {
      console.error('No file selected or user ID not set');
    }
  }
  togglePostMode() {
    this.isPostMode = !this.isPostMode;
  }
  showPhotoOptions() {
    if (this.showPhotoOptionsModal) {
      // If the modal is already open, close it
      this.closePhotoOptions();
    } else {
      // If the modal is closed, open it and close any other modals
      this.closeOtherModals();  
      this.showPhotoOptionsModal = true;
    }
  }
  closePhotoOptions() {
    this.showPhotoOptionsModal = false;
}
 
openGallery() {
  this.showPhotoOptionsModal = false; // Close the photo options modal
 this.fileInput.nativeElement.click();
 this.closeOtherModals();  
}
 
//shorts////
 
ngOnDestroy(): void {
  if (this.observer) {
    this.observer.disconnect();
  }
}
 
setupIntersectionObserver(): void {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.8
  };
 
  this.observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const video = entry.target as HTMLVideoElement;
        this.playVideo(video);
      } else {
        const video = entry.target as HTMLVideoElement;
        this.pauseVideo(video);
      }
    });
  }, options);
}
 
videoLoaded(video: HTMLVideoElement, index: number): void {
  if (this.observer) {
    this.observer.observe(video);
    if (index === 0) {
      this.playVideo(video);
    }
  }
}
 
playVideo(video: HTMLVideoElement): void {
  if (this.currentPlayingVideo && this.currentPlayingVideo !== video) {
    this.currentPlayingVideo.pause();
  }
  video.play();
  this.currentPlayingVideo = video;
}
 
pauseVideo(video: HTMLVideoElement): void {
  video.pause();
  if (this.currentPlayingVideo === video) {
    this.currentPlayingVideo = null;
  }
}
 
togglePlayPause(video: HTMLVideoElement): void {
  if (video.paused) {
    this.playVideo(video);
  } else {
    this.pauseVideo(video);
  }
}
 
openFullScreenView(index: number): void {
  this.reorderShorts(index);
  this.isFullScreenView = true;
  setTimeout(() => {
    this.setupIntersectionObserver();
  }, 0);
}
 
closeFullScreenView(): void {
  this.isFullScreenView = false;
  if (this.currentPlayingVideo) {
    this.currentPlayingVideo.pause();
    this.currentPlayingVideo = null;
  }
  if (this.observer) {
    this.observer.disconnect();
  }
}
 
reorderShorts(startIndex: number): void {
  this.reorderedShorts = [
    ...this.shorts.slice(startIndex),
    ...this.shorts.slice(0, startIndex)
  ];
}
 
likeShorts(short: any) {
  this.fusionService.reactToPost('video', 'like', short.id).subscribe(
    response => {
      short.liked = !short.liked;
      short.likes += short.liked ? 1 : -1;
    },
    error => {
      console.error('Error liking short:', error);
    }
  );
}
 
shareShorts(short: any) {
  if ('share' in navigator) {
    navigator.share({
      title: `Check out this short video`,
      url: short.url
    }).then(() => {
      console.log('Short shared successfully');
      this.incrementShortShareCount(short);
    }).catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Error sharing short:', error);
      } else {
        console.log('Share dialog was closed without sharing');
      }
    });
  } else {
    console.log('Web Share API is not supported in your browser.');
    this.fallbackShareShort(short);
  }
}
 
 
private fallbackShareShort(short: any) {
  const dummy = document.createElement('input');
  document.body.appendChild(dummy);
  dummy.value = short.url;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
 
  alert('Short video link copied to clipboard. You can now paste it to share.');
}
 
private incrementShortShareCount(short: any): void {
  this.fusionService.reactToPost('video', 'share', short.id).subscribe(
    response => {
      console.log('Short share count incremented successfully');
      short.shares++;
    },
    error => {
      console.error('Error incrementing short share count:', error);
    }
  );
}
 

addCommentToShort(short: any): void {
  const trimmedComment = this.newComment.trim();
  if (!trimmedComment || !this.user || typeof this.user.id !== 'number') {
    console.error('Invalid comment or user');
    return;
  }
 
  this.fusionService.reactToPost(
    'video',
    'comment',
    short.id,
    this.user.id,
    trimmedComment
  ).subscribe(
    (response: any) => {
      console.log('Comment added successfully', response);
     
      if (!this.comments[short.id]) {
        this.comments[short.id] = [];
      }
 
      this.comments[short.id].push(response);
      this.newComment = '';
    },
    (error) => {
      console.error('Error adding comment:', error);
    }
  );
}

toggleDescription(index: number) {
  this.showFullDescription[index] = !this.showFullDescription[index];  // Toggle between true/false
}

// Method to show part of the description with 'Read More' for non-articles
getPartialDescription(description: string, isArticle: boolean): string {
  const limit = isArticle ? this.articleInitialCharacterLimit : this.initialCharacterLimit;
  return description.length > limit ? description.slice(0, limit) : description;
}
toggleArticleDescription(index: number) {
  this.showFullDescription[index] = !this.showFullDescription[index];
}

// Method to get partial description for an article
getPartialArticleDescription(description: string): string {
  return description.length > this.articleInitialCharacterLimit ? description.slice(0, this.articleInitialCharacterLimit) : description;
}
 
 ////groups////
 
 openCreateGroupModal(): void {
  this.showCreateGroupModal = true;
}
 
closeCreateGroupModal(): void {
  this.showCreateGroupModal = false;
  this.newGroupName = '';
  this.selectedMembers = [];
}
 
createGroup(): void {
  if (this.newGroupName && this.selectedMembers.length > 0) {
    const newGroup: Group = {
      id: this.groups.length + 1, // This is a simplistic way to generate an ID
      name: this.newGroupName
    };
    this.groups.push(newGroup);
    // Here you would typically call a service to save the new group
    console.log('Creating group:', newGroup, 'with members:', this.selectedMembers);
    this.closeCreateGroupModal();
  }
}
 
 
 
 
//shorts///
addPost() {
  if (this.newPost.content || this.newPost.image || this.newPost.video || this.newShortVideo) {
    const fileInput: HTMLInputElement = this.fileInput.nativeElement;
    const description = this.newPost.content;
    const tag = this.newPost.tag;   


    if (this.newShortVideo) {
      // Handle short video upload
      this.uploadShortVideo(this.newShortVideo, description,tag);
    } else if (this.newPost.image) {
      // Handle both captured and selected images
      if (this.newPost.image.startsWith('data:image')) {
        // This is a captured image
        this.handleCapturedImage(this.newPost.image, description,tag);
      } else {
        // This is a selected image file
        const file = this.dataURLtoFile(this.newPost.image, 'selected_image.jpg');
        this.uploadImage(file, description,tag);
      }
    } else if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      if (file.type.startsWith('video/')) {
        this.uploadVideo(file, description,tag);
      } else if (file.type.startsWith('image/')) {
        this.uploadImage(file, description,tag);
      }
    } else if (this.newPost.video) {
      // Handle the case where video is set but not from file input
      if (this.newPost.video instanceof File) {
        // If it's already a File object, use it directly
        this.uploadVideo(this.newPost.video, description,tag);
      } else if (typeof this.newPost.video === 'string' && this.newPost.video.startsWith('blob:')) {
        // If it's a blob URL, fetch it and create a File object
        fetch(this.newPost.video)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "video.mp4", { type: "video/mp4" });
            this.uploadVideo(file, description,tag);
          });
      }
    } else if (this.newPost.content) {
      // Handle text-only post
      this.postTextOnly(description,tag);
    }
  } else {
    this.errorMessage = 'Please enter a description or select media before posting.';
    return;
  }
  
  this.closePostOverlay();
  this.clearForm();
}

resetForm() {
  this.newPost = {
    content: '',
    image: null,
    video: null
  };
  this.newShortVideo = null;
  this.shortVideoPreviewUrl = null;
  this.isShortVideoMode = false;
  this.isPostMode = false;
  if (this.fileInput) {
    this.fileInput.nativeElement.value = '';
  }
  if (this.shortVideoInput) {
    this.shortVideoInput.nativeElement.value = '';
  }
}



 
// Helper function to convert data URL to File object
dataURLtoFile(dataurl: string, filename: string): File {
  let arr = dataurl.split(',');
  let mime = 'image/jpeg'; // Default MIME type
  let bstr: string;
 
  if (arr.length > 1) {
      let mimeMatch = arr[0].match(/:(.*?);/);
      if (mimeMatch) {
          mime = mimeMatch[1];
      }
      bstr = atob(arr[1]);
  } else {
      bstr = atob(dataurl);
  }
 
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
 
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
 
  return new File([u8arr], filename, {type: mime});
}
 
uploadImage(file: File, description: string,tag:string): void {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('imageDescription', description);
  formData.append('tag', tag);

  formData.append('userId', this.userId.toString());
 
  this.fusionService.createImagePost(this.userId, file, description,tag).subscribe(
    response => {
      console.log('Image post created successfully', response);
      const newImagePost = this.transformToVideoFormat(response, 'image');
      this.addNewPostToCombined(newImagePost);
      this.clearForm();
    },
    error => {
      console.error('Error creating image post', error);
      // Handle error
    }
  );
}
 
 
uploadVideo(file: File, description: string,tag:string): void {
  if (!(file instanceof File)) {
    console.error('Invalid file object');
    return;
  }
 
  const tempPost: Post = {
    id: Date.now(),
    description: description,
    isVideo: true,
    isImage: false,
    isArticle: false,
    src: '',
    userId: this.user?.id || 0, // Add this line, with a default 

    profileName: this.user.name,
    profileImage: this.userImage || '',
    url: '',
    type: 'image',
    title: '',
    likes: 0,
    views:0,
    comments: [],
    shares: 0,
    content: '',
    timestamp: '',
    createdAt: '',
    tag:'',
    text: [],
    videoCommentContent: [],
    shortVideoLikes: 0,
    shortVideoShares: 0,
    shortVideoViews: 0,
    commentDate: ''
  };
 
  this.addNewPostToCombined(tempPost);
 
  this.fusionService.uploadLongVideo(this.userId, file, description,tag).subscribe({
    next: (response) => {
      console.log('Video upload completed', response);
      this.handleSuccessfulUpload(response, tempPost.id);
    },
    error: (error: HttpErrorResponse) => {
      console.error('Error during video upload', error);
 
      if (error.status === 200) {
        console.log('Received 200 status with parsing error. Raw response:', error.error.text);
        // Extract URL from the raw response text
        const match = error.error.text.match(/URL: (.*?)$/);
        const videoUrl = match ? match[1].trim() : '';
 
        if (videoUrl) {
          console.log('Extracted video URL:', videoUrl);
          this.handleSuccessfulUpload({ src: videoUrl }, tempPost.id);
        } else {
          console.warn('Could not extract video URL from response');
          this.handleSuccessfulUpload({}, tempPost.id);
        }
      } else if (error instanceof SyntaxError) {
        console.log('Treating SyntaxError as successful upload');
        this.handleSuccessfulUpload({}, tempPost.id);
      } else {
        const index = this.combinedPosts.findIndex(post => post.id === tempPost.id);
        if (index !== -1) {
          this.combinedPosts[index] = {
            ...this.combinedPosts[index],
            uploadFailed: true
          };
          this.cdRef.detectChanges();
        }
        alert('Error uploading video. The post will appear when you refresh.');
      }
    }
  });
}
 
private handleSuccessfulUpload(response: any, tempId: number): void {
  const index = this.combinedPosts.findIndex(post => post.id === tempId);
  if (index !== -1) {
    this.combinedPosts[index] = {
      ...this.combinedPosts[index],
      ...response,
      id: response.id || tempId,
      src: response.src || this.combinedPosts[index].src,
      uploadFailed: false
    };
    this.cdRef.detectChanges();
  }
  this.clearForm();
  this.newPost = {};
  alert('Video uploaded successfully! It may take a moment to process and appear.');
}
 

 
    handleCapturedImage(dataUrl: string, description: string,tag:string) {
      fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
              const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
              this.uploadImage(file, description,tag);
          })
          .catch(error => console.error('Error processing captured image:', error));
  }
 
  capturePhoto() {
      if (this.liveVideo && this.photoCanvas) {
          const video = this.liveVideo.nativeElement;
          const canvas = this.photoCanvas.nativeElement;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
 
          // Set the captured image directly to newPost.image
          this.newPost.image = canvas.toDataURL('image/jpeg');
          this.newPost.video = null;
          this.newPost.isImage = true;
          this.newPost.isVideo = false;
          this.newPost.isArticle = false;
          this.isPostMode = true; // Trigger the overlay
          this.stopCamera();
          this.showMediaOptions = false; // Close the media options
          console.log('Photo captured and set to newPost.image');
      }
  }
 
  postCapturedPhoto() {
      if (this.newPost.image) {
          console.log('Posting captured photo');
          this.showMediaOptions = false;
          this.isPostMode = true; // Ensure the overlay is shown
          // Don't call addPost() here, let the user add a description if they want
      } else {
          console.error('No captured image to post');
      }
  }
    clearForm() {
      this.newPost = { content: '', image: null, video: null, article: null };
      this.isArticleMode = false;
      this.showMediaOptions = false;
      this.capturedImage = null; // Clear captured image
      this.newShortVideo = null; // Clear short video file
      this.shortVideoPreviewUrl = null; // Clear short video preview URL
      this.isShortVideoMode = false; // Reset short video mode
    
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
      if (this.shortVideoInput) {
        this.shortVideoInput.nativeElement.value = '';
      }
    }
   
    postArticle() {
      if (this.newPost.article && !this.isPosting) {
        this.isPosting = true;
        this.fusionService.createArticlePost(this.userId, this.newPost.article).subscribe(
          response => {
            console.log('Article post created successfully', response);
            const newArticle = this.transformToVideoFormat(response, 'article');
            this.addNewPostToCombined(newArticle);
            this.toggleArticleMode();
            this.clearForm();
            this.isPosting = false;
          },
          error => {
            console.error('Error creating article post', error);
            this.isPosting = false;
          }
        );
      }
    }
   
   
    postTextOnly(description: string,tag:string) {
      // Implement this method to handle text-only posts
      console.log('Posting text-only:', description,tag);
      // Call your service method to post text-only content
    }
    toggleArticleMode() {
      this.isArticleMode = !this.isArticleMode;
      if (this.isArticleMode) {
        this.newPost.article = ''; // Initialize empty article content
      } else {
        this.newPost.article = null; // Clear article content if mode is toggled off
      }
    }
   
    handleImageErrors(event: any) {
      console.error('Image failed to load:', event.target.src);
      event.target.src = 'assets/default-avatar.png';  // Make sure this file exists in your assets folder
    }
    createArticlePost(): void {
      if (this.newPost.content) {
        this.fusionService.createArticlePost(this.userId, this.newPost.content).subscribe(
          response => {
            console.log('Article post created successfully', response);
            // Handle successful article post creation
          },
          error => {
            console.error('Error creating article post', error);
            // Handle error
          }
        );
      }
    }
   
   
    adjustTextareaHeight(textarea: HTMLTextAreaElement) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
    onFileSelected(event: any) {
      this.closePhotoOptions();
      this.closeOtherModals();  // Close the photo modal if open
      const file = event.target.files[0];
      if (file) {
          if (file.type.startsWith('image/')) {
              // Image handling
              const reader = new FileReader();
              reader.onload = (e: any) => {
                  this.newPost.image = e.target.result;
                  this.newPost.video = null;
                  this.newPost.isImage = true;
                  this.newPost.isVideo = false;
                  this.newPost.isArticle = false;
                  this.isPostMode = true; // Trigger the overlay
              };
              reader.readAsDataURL(file);
          } else if (file.type.startsWith('video/')) {
              const videoElement = document.createElement('video');
              videoElement.preload = 'metadata';
              videoElement.src = URL.createObjectURL(file);
 
              videoElement.onloadedmetadata = () => {
                  const duration = videoElement.duration;
                  const width = videoElement.videoWidth;
                  const height = videoElement.videoHeight;
 
                  // Define criteria for normal videos
                  const minDuration = 60; // seconds (1 minute)
                  const maxDuration = 3600; // seconds (1 hour, adjust as needed)
                  const minWidth = 640; // pixels
                  const minHeight = 360; // pixels
 
                  if (duration >= minDuration && duration <= maxDuration && width >= minWidth && height >= minHeight) {
                      // This is a normal video, proceed with preview
                      this.newPost.video = URL.createObjectURL(file);
                      this.newPost.image = null;
                      this.newPost.isImage = false;
                      this.newPost.isVideo = true;
                      this.newPost.isArticle = false;
                      this.newPost.videoFile = file; // Store the file for later upload
                      this.isPostMode = true; // Trigger the overlay
                  } else {
                      console.error('Video does not meet criteria for normal videos');
                      alert('Video does not meet criteria for normal videos. Please ensure your video is at least 1 minute long, not longer than 1 hour, and has a minimum resolution of 640x360.');
                  }
 
                  URL.revokeObjectURL(videoElement.src);
              };
 
              videoElement.onerror = () => {
                  console.error('Error loading video metadata');
                  alert('Error loading video metadata. Please try again with a different video.');
                  URL.revokeObjectURL(videoElement.src);
              };
          }
      }
  }
   
    closePostOverlay() {
      this.isPostMode = false;
      this.cancelMedia(); // This will clear the image/video and reset the file input
      this.newPost.content = '';
      this.resetForm();
      this.clearForm();


    }
    cancelMedia() {
         this.newPost.image = null;
         this.newPost.video = null;
         if (this.fileInput) {
           this.fileInput.nativeElement.value = '';
         }
         // Add this line to close the overlay when media is cancelled
         this.isPostMode = false;
       }
       addNewPostToCombined(newPost: Post) {
         console.log('Adding new post to combined posts:', newPost);
         this.combinedPosts.unshift(newPost);
         this.cdRef.detectChanges();
       }
    
       onShortVideoSelected(event: any) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
          this.newShortVideo = file;
          this.shortVideoPreviewUrl = URL.createObjectURL(file);
          this.isPostMode = true;
          this.isShortVideoMode = true;
        } else {
          this.errorMessage = 'Please select a valid video file.';
        }
      }
     triggerShortVideoUpload() {
      this.closeOtherModals();  // Close the photo modal if open

       this.shortVideoInput.nativeElement.click();
     }
    
    
     uploadShortVideo(file: File, description: string,tag:string): void {
      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);
    
      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;
    
        // Example criteria for shorts:
        const maxDuration = 120; // seconds
        const maxWidth = 1080; // pixels
        const maxHeight = 1920; // pixels
    
        if (duration <= maxDuration && width <= maxWidth && height <= maxHeight) {
          console.log('Uploading short video:', file.name);
          this.errorMessage = ''; // Clear any previous error message
          this.fusionService.uploadShortVideo(this.userId, file, description,tag).subscribe(
            response => {
              console.log('Short video uploaded successfully', response);
              const newShortVideo = this.transformToVideoFormat(response, 'video');
              this.shorts.unshift(newShortVideo);
              alert('Short Video uploaded successfully.');
            },
            error => {
              if (error.status !== 200) {
                console.error('Error uploading short video', error);
                this.errorMessage = 'Error uploading short video. Please try again.';
              } else {
                // If status is 200, treat it as a success
                console.log('Short video uploaded successfully');
                alert('Short Video uploaded successfully.');
    
                const newShortVideo = this.transformToVideoFormat(error.error, 'video');
                this.shorts.unshift(newShortVideo);
              }
            }
          );
        } else {
          this.errorMessage = 'Video does not meet the criteria for shorts. Please ensure your video is no longer than 120 seconds and has a max resolution of 1080x1920. Or Upload in Video Section';
        }
      };
    
      videoElement.onerror = () => {
        this.errorMessage = 'Error loading video metadata. Please try again with a different video.';
      };
    }
     clearErrorMessage(): void {
       this.errorMessage = '';
     }
    
     getShorts1(): void {  
      const userId = this.getUserId();  
      if (userId === 0) {  
        console.error('Cannot fetch shorts: No user is logged in');  
        this.getShorts2();  
        return;  
      }  
    
      const requestBody = { user_id: userId.toString() };  
    
      this.fusionService.feedShortVideos(requestBody).subscribe(  
        (data) => {  
          if (data.length === 0) {  
            console.log('No short videos found.');  
            this.getShorts2();  
          } else {  
            this.shorts = data.map(video => ({  
              id: video.short_video_id,  
              src: video.shortVideoDetails.s3Url,  
              profileName: video.user.name,  
              profileImage: video.user.userImage,  
              likes: video.shortVideoDetails.shortVideoLikes || 0,  
              shares: video.shortVideoDetails.shortVideoShares || 0,  
              timestamp: new Date(video.shortVideoDetails.createdAt),  
              views: video.shortVideoDetails.shortVideoViews || 0,  
              tag: video.shortVideoDetails.tag || null,  
              url: video.shortVideoDetails.s3Url,  
              type: 'video',  
              title: video.shortVideoDetails.shortVideoTitle || '',  
              comments: video.shortVideoDetails.videoComments || [],  
              longVideoDescription: video.shortVideoDetails.shortVideoDescription  
            }));  
    
            // Sort shorts by timestamp in descending order (most recent first)  
            this.shorts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());  
    
            this.shorts.forEach(short => this.checkLikeStatusShort(short));  
    
            this.reorderedShorts = [...this.shorts]; // Create a copy of sorted shorts  
            console.log('Transformed and sorted shorts:', this.shorts);  
            console.log('Reordered shorts:', this.reorderedShorts);  
          }  
        },  
        (error) => {  
          console.error('Error fetching videos:', error);  
          this.getShorts2();  
        }  
      );  
    }  
    
    getShorts2(): void {  
      this.fusionService.getShortVideos().subscribe(  
        (data) => {  
          if (data.length === 0) {  
            console.log('No short videos found.');  
            this.shorts = [];  
          } else {  
            this.shorts = data.map(video => this.transformToVideoFormatShorts(video, 'video'));  
    
            // Sort shorts by timestamp in descending order (most recent first)  
            this.shorts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());  
    
            this.shorts.forEach(short => this.checkLikeStatusShort(short));  
    
            this.reorderedShorts = [...this.shorts]; // Create a copy of sorted shorts  
            console.log('Transformed and sorted shorts:', this.shorts);  
            console.log('Reordered shorts:', this.reorderedShorts);  
          }  
        },  
        (error) => {  
          console.error('Error fetching videos:', error);  
          this.shorts = [];  
        }  
      );  
    }  
    
    transformToVideoFormatShorts(video: any, type: string): any {  
      return {  
        id: video.id,  
        src: video.s3Url,  
        profileName: video.user.name,  
        profileImage: video.user.userImage,  
        likes: video.shortVideoLikes || 0,  
        shares: video.shortVideoShares || 0,  
        timestamp: new Date(video.createdAt),  
        views: video.shortVideoViews || 0,  
        tag: video.tag || null,  
        url: video.s3Url,  
        type: type,  
        title: video.shortVideoTitle || '',  
        comments: video.videoComments || [],  
        longVideoDescription: video.shortVideoDescription  
      };  
    }
       
        private getUserId(): number {
          const currentUserId = this.authService.getId();
          if (currentUserId) {
            return Number(currentUserId);
          } else {
            console.error('No user is currently logged in');
            return 0; // or any other default value that makes sense in your application
          }
        }
     
    
    transformToVideoFormats(video: any, type: string) {
      return {
        id: video.id,
        src: video.s3Url,
        profileName: video.user.name,
        profileImage: video.user.userImage,
        likes: type === 'video' ? video.longVideoLikes || 0 : 0,
        shares: type === 'video' ? video.VideoShares || 0 : 0,
        timestamp: video.createdAt,
        tag: video.tag, // Add this line
        // ... other properties
      };
    }
    
    
     transformToVideoFormat(item: any, type: 'video' | 'image' | 'article'): Post {
       const createImageSrc = (imageData: string): string => {
    
         if (imageData.startsWith('data:image')) {
           return imageData;
         } else if (imageData.startsWith('http') || imageData.startsWith('http')) {
           return imageData;
         } else {
           return `data:image/jpeg;base64,${imageData}`;
         }
       };
    
       let mappedComments: any[] = [];
    
       try {
         mappedComments = Array.isArray(item.videoCommentContent) ?
           item.videoCommentContent.map((comment: any) => ({
             id: comment.id,
             content: comment.videoCommentContent || '',
             author: comment.user?.name || 'Unknown Author',
           createdAt: new Date(comment.createdAt).toISOString(),  // Ensure correct date format
           })) :
           [];
       } catch (error) {
         console.error('Error mapping comments:', error);
       }
       const profileImage: SafeUrl = this.sanitizeImage(item.user?.userImage || '../../assets/download.png');
    
       return {
         id: item.id,
         type,
         url: '',
         description: item.description || '',
         title: item.title || '',
         isVideo: type === 'video',
         isImage: type === 'image',
         isArticle: type === 'article',
         src: type === 'image' ? createImageSrc(item.photo) : (type === 'video' ? item.s3Url : ''),
         likes: type === 'article' ? item.articleLikeCount || 0 : 
       (type === 'image' ? item.imageLikeCount || 0 : 
       (type === 'video' ? item.longVideoLikes || 0 : 
       (type === 'longVideo' ? item.longVideoLikes || 0 : 0))),

        shares: type === 'article' ? item.articleShareCount || 0 : 
        (type === 'image' ? item.imageShareCount || 0 : 
        (type === 'video' ? item.longVideoShares || 0 : 
        (type === 'longVideo' ? item.shortVideoShares || 0 : 0))),
         timestamp: item.postDate,
         createdAt:item.createdAt ,
         commentDate:item.commentDate,
         comments: mappedComments,
         showComments: false,
         liked: false,
         showShareMenu: false,
         views:type === 'video' ? item.longVideoViews || 0 : 0,

         saved: false,
         userId: item.user?.id || 0, 
         tag:item.tag,

         profileImage,
         profileName: item.user?.name || 'Unknown User',
         content: type === 'article' ? item.article || '' : (type === 'image' ? item.imageDescription || '' : item.longVideoDescription || ''),
         showFullContent: false,
         showShareModal: false,
         videoCommentContent: item.videoCommentContent || [],
         text:item.text ||  [],
         shortVideoLikes: item.longVideoLikes || 0,
         shortVideoShares: item.longVideoShares || 0,
         shortVideoViews: item.shortVideoViews || 0
       };
     }
    
    
    
     sanitizeImage(imageData: string): SafeUrl {
     if (imageData.startsWith('data:image')) {
       return this.sanitizer.bypassSecurityTrustUrl(imageData);
     } else if (imageData.startsWith('http') || imageData.startsWith('http')) {
       return this.sanitizer.bypassSecurityTrustUrl(imageData);
     } else {
       // Assuming imageData is base64 encoded JPEG
       return this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${imageData}`);
     }
   }
    
    
    
   onFileSelected1(event: any, context: 'profile' | 'post') {
    this.closePhotoOptions();

    this.closeOtherModals();  // Close the photo modal if open

     const file = event.target.files[0];
     if (file) {
       if (file.type.startsWith('image/')) {
         const reader = new FileReader();
         reader.onload = (e: any) => {
           if (context === 'profile') {
             this.newImage = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
             this.selectedFile = file; 
             this.showImagePreview();
           } else if (context === 'post') {
             this.newPost.image = e.target.result;
             this.newPost.video = null;
             this.newPost.isImage = true;
             this.newPost.isVideo = false;
             this.newPost.isArticle = false;
           }
         };
         reader.readAsDataURL(file);
       } else if (file.type.startsWith('video/') && context === 'post') {
         // Only handle video if the context is 'post'
         const videoElement = document.createElement('video');
         videoElement.preload = 'metadata';
         videoElement.src = URL.createObjectURL(file);
    
         videoElement.onloadedmetadata = () => {
           const duration = videoElement.duration;
           const width = videoElement.videoWidth;
           const height = videoElement.videoHeight;
    
           const minDuration = 60;
           const maxDuration = 3600; 
           const minWidth = 640; 
           const minHeight = 360;
    
           if (duration >= minDuration && duration <= maxDuration && width >= minWidth && height >= minHeight) {
             this.newPost.video = URL.createObjectURL(file);
             this.newPost.image = null;
             this.newPost.isImage = false;
             this.newPost.isVideo = true;
             this.newPost.isArticle = false;
             this.newPost.videoFile = file;
           } else {
             console.error('Video does not meet criteria for normal videos');
             alert('Video does not meet criteria for normal videos. Please ensure your video is at least 1 minute long, not longer than 1 hour, and has a minimum resolution of 640x360.');
           }
    
           URL.revokeObjectURL(videoElement.src);
         };
    
         videoElement.onerror = () => {
           console.error('Error loading video metadata');
           alert('Error loading video metadata. Please try again with a different video.');
           URL.revokeObjectURL(videoElement.src);
         };
       }
     }
   }
    
   toggleSaveShort(short: any) {
    short.saved = !short.saved;
  }
   savePost(post: any) {
    const userIdString = localStorage.getItem('id');
    if (!userIdString) {
      console.error('User ID not available');
      return;
    }
    const userId = parseInt(userIdString, 10);
  
    let saveEndpoint: string;
    let postIdParam: string;
  
    switch (post.type) {
      case 'image':
        saveEndpoint = 'saveImagePost';
        postIdParam = 'imagePostId';
        break;
      case 'article':
        saveEndpoint = 'saveArticlePost';
        postIdParam = 'articlePostId';
        break;
      case 'video':
      case 'shortVideo':
        saveEndpoint = 'saveShortVideo';
        postIdParam = 'shortVideoId';
        break;
      default:
        console.error('Unknown post type:', post.type);
        this.showAlert('Error saving post. Unknown post type.');
        return;
    }
    if (post.saved) {
      // If the post is marked as saved, attempt to unsave it
      this.attemptUnsave(post, userId);
    } else {
      // If the post is not saved, attempt to save it
      this.fusionService.savePost(saveEndpoint, userId, post.id, postIdParam).subscribe(
        (response: any) => {
          post.saved = true;
          post.savedItemId = response.id;
          console.log('Post saved successfully');
          this.showAlert('Post saved successfully');
        },
        (error: HttpErrorResponse) => {
          if (error.status === 200 && error.error === 'Item already saved') {
            post.saved = true;
            // Since the item is already saved, we need to fetch the savedItemId
            this.fetchSavedItemId(post, userId);
            this.showAlert('Post already saved');
          } else {
            console.error('Error saving post:', error);
            this.showAlert('Error saving post. Please try again.');
          }
        }
      );
    }
  }
  
  private attemptUnsave(post: any, userId: number) {
    if (!post.savedItemId) {
      // If savedItemId is not available, try to fetch it first
      this.fetchSavedItemId(post, userId).then(() => {
        this.performUnsave(post, userId);
      }).catch(error => {
        console.error('Error fetching savedItemId:', error);
        this.showAlert('Error unsaving post. Please try again.');
      });
    } else {
      this.performUnsave(post, userId);
    }
  }
  
  private fetchSavedItemId(post: any, userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // Convert 'video' type to 'shortVideo' for backend compatibility
      const postType = post.type === 'video' ? 'shortVideo' : post.type;
      
      this.fusionService.getSavedItemId(postType, userId, post.id).subscribe(
        (savedItemId: number) => {
          post.savedItemId = savedItemId;
          resolve();
        },
        error => {
          console.error('Error fetching savedItemId:', error);
          reject(error);
        }
      );
    });
  }
  
  private performUnsave(post: any, userId: number) {
    let deleteEndpoint: string;
    switch (post.type) {
      case 'image':
        deleteEndpoint = 'deleteImagePost';
        break;
      case 'article':
        deleteEndpoint = 'deleteArticlePost';
        break;
      case 'video':
      case 'shortVideo':
        deleteEndpoint = 'deleteShortVideo';
        break;
      default:
        console.error('Unknown post type:', post.type);
        this.showAlert('Error unsaving post. Unknown post type.');
        return;
    }
    this.fusionService.unsavePost(deleteEndpoint, userId, post.id).subscribe(
      () => {
        post.saved = false;
        post.savedItemId = undefined;
        console.log('Post unsaved successfully');
        this.showAlert('Post unsaved successfully');
      },
      (error) => {
        console.error('Error unsaving post:', error);
        this.showAlert('Error unsaving post. Please try again.');
      }
    );
  }
  
  private showAlert(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  updateSavedStatus(posts: any[]) {
    const userIdString = localStorage.getItem('id');
    if (!userIdString) {
      console.error('User ID not available');
      return;
    }
    const userId = parseInt(userIdString, 10);
  
    this.fusionService.getAllSavedItems(userId).subscribe(
      (savedItems: any) => {
        posts.forEach(post => {
          switch (post.type) {
            case 'image':
              post.saved = savedItems.imagePosts.some((savedPost: any) => savedPost.id === post.id);
              break;
            case 'article':
              post.saved = savedItems.articlePosts.some((savedPost: any) => savedPost.id === post.id);
              break;
            case 'video':
            case 'shortVideo':
              post.saved = savedItems.shortVideos.some((savedPost: any) => savedPost.id === post.id);
              break;
            // Remove the 'longVideo' case as it's no longer needed
          }
        });
      },
      error => {
        console.error('Error fetching saved items:', error);
      }
    );
  }
  
    
    ///save////
    
    
    
    
    
    
    
     toggleComments(postId: number, postType: 'video' | 'article' | 'image'): void {
       const post = this.combinedPosts.find(post => post.id === postId && post.type === postType);
       if (post) {
         post.showComments = !post.showComments;
         if (post.showComments && !this.comments[postId]) {
           this.fetchComments(postType, postId);
         }
       } else {
         console.error('Post not found');
       }
     }
     addComment(postId: number, postType: 'video' | 'article' | 'image'): void {
      // Find the post in the combinedPosts array
      const post = this.combinedPosts.find(post => post.id === postId && post.type === postType);
      if (!post) {
        console.error('Post not found');
        return;
      }
    
      // Trim the new comment and check if it's empty
      const trimmedComment = this.newComment.trim();
      if (!trimmedComment) {
        console.error('Comment is empty');
        return;
      }
    
      // Ensure the user is logged in and the user ID is valid
      if (!this.user || typeof this.user.id !== 'number') {
        console.error('User not logged in or user ID is not a number');
        return;
      }
    
      // Make an API call to add the comment
      this.fusionService.reactToPost(
        postType,
        'comment',
        postId,
        this.user.id,
        postType === 'video' ? trimmedComment : undefined,
        postType === 'image' ? trimmedComment : undefined,
        postType === 'article' ? trimmedComment : undefined
      ).subscribe(
        (response: any) => {
          console.log('Comment added successfully', response);
          
          // Ensure that the post has a comments array
          if (!this.comments[postId]) {
            this.comments[postId] = [];
          }
    
          // Add the new comment at the beginning of the array (unshift)
          this.comments[postId].unshift({
            ...response,      // Include all properties from the API response
            replies: [],      // Initialize an empty array for replies to this comment
            showReply: false  // Initialize the showReply property to false
          });
    
          // Trigger change detection by creating a new array reference
          this.comments[postId] = [...this.comments[postId]];
    
          // Clear the newComment field after posting
          this.newComment = '';
        },
        (error) => {
          console.error('Error adding comment:', error);
          // Handle error if needed
        }
      );
    }
    


     toggleReplies(commentId: number) {

       this.repliesVisible[commentId] = !this.repliesVisible[commentId];
       this.showReplies[commentId] = !this.showReplies[commentId];

     }
    
    
     toggleReply(commentId: number): void {
       this.replyingTo[commentId] = !this.replyingTo[commentId];
       if (!this.replyingTo[commentId]) {
         this.newReply[commentId] = '';
       }
     }
    
     addReply(postId: number, postType: 'video' | 'article' | 'image', commentId: number, content: string): void {
      // Trim the reply content and validate user and reply content
      const trimmedReply = this.newReply[commentId].trim();
      if (!trimmedReply || !this.user || typeof this.user.id !== 'number') {
        console.error('Invalid reply or user');
        return;
      }
    
      // Make an API call to add the reply
      this.fusionService.addReplyToComment(
        postType,
        postId,
        this.user.id,
        trimmedReply,
        commentId,
        content
      ).subscribe(
        (response: any) => {
          console.log('Reply added successfully', response);
          
          // Ensure that the comment has a replies array
          if (!this.replies[commentId]) {
            this.replies[commentId] = [];
          }
    
          // Add the new reply to the beginning of the replies array (unshift)
          this.replies[commentId].unshift({
            ...response,         // Include all properties from the API response
            user: this.user,     // Include the current user information
            createdAt: new Date().toISOString(), // Set the creation time
            text: trimmedReply   // Include the trimmed reply text
          });
    
          // Trigger change detection by creating a new array reference
          this.replies[commentId] = [...this.replies[commentId]];
    
          // Clear the reply field and hide the reply form
          this.newReply[commentId] = '';
          this.replyingTo[commentId] = false;
        },
        (error) => {
          console.error('Error adding reply:', error);
          // Handle error if needed
        }
      );
    }
    
     likePost(post: any) {
       this.fusionService.reactToPost(post.type,'like',post.id).subscribe(
         response => {
           // Handle successful like
           post.liked = !post.liked;
           post.likes += post.liked ? 1 : -1;
         },
         error => {
           // Handle error
           console.error('Error liking post:', error);
         }
       );
     }
    
    
    
     sharePost(post: Post) {
       if ('share' in navigator) {
         navigator.share({
           title: `Check out this ${post.type}`,
           url: post.url
         }).then(() => {
           console.log('Content shared successfully');
           this.incrementShareCount(post);
         }).catch((error) => {
           if (error.name !== 'AbortError') {
             console.error('Error sharing content:', error);
           } else {
             console.log('Share dialog was closed without sharing');
           }
         });
       } else {
         console.log('Web Share API is not supported in your browser.');
         // Implement fallback sharing method here
         this.fallbackShare(post);
       }
     }
    
     private fallbackShare(post: Post) {
       // Implement a fallback sharing method
       // For example, you could copy the link to clipboard
       const dummy = document.createElement('input');
       document.body.appendChild(dummy);
       dummy.value = post.url;
       dummy.select();
       document.execCommand('copy');
       document.body.removeChild(dummy);
    
       alert('Link copied to clipboard. You can now paste it to share.');
      
       // Only increment the share count if you consider copying to clipboard as a share action
       // this.incrementShareCount(post);
     }
    
     incrementShareCount(post: Post): void {
       this.fusionService.reactToPost(post.type, 'share', post.id).subscribe(
         response => {
           console.log('Share count incremented successfully');
           // Increment the share count locally
           post.shares++;
           // If the API returns the updated share count, use that instead
           // post.shares = response.shareCount;
         },
         error => {
           console.error('Error incrementing share count:', error);
         }
       );
     }


     reactToPost(type: 'video' | 'article' | 'image', action: 'like' | 'dislike' | 'share' | 'view' | 'comment', postId: number, userId?: number, content?: string): void {
       console.log('Before action:', ); // Log the post before the action
    
       // Optimistically update UI
    
       // Call the service
       this.fusionService.reactToPost(type, action, postId, userId, content).subscribe(
         response => {
           console.log('Action successful:', response);
           // Fetch the updated post from the server
           this.post.liked = !this.post.liked;
       this.post.likes += this.post.liked ? 1 : -1;
    
         },
         error => {
           console.error('Error performing action:', error);
           // Revert the optimistic update in case of error
         }
       );
     }
    
     // Helper method to get a post by id
    
    
    
    
     fetchComments(postType: 'video' | 'article' | 'image', postId: number): void {
      this.fusionService.getCommentss(postType, postId).subscribe(
        (comments: any[]) => {
          // Sort comments by timestamp in ascending order, then reverse
          comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          comments.reverse();
    
          // Map and initialize the replies array
          this.comments[postId] = comments.map(comment => ({
            ...comment,
            replies: []
          }));
    
          // Fetch replies for each comment
          this.comments[postId].forEach(comment => {
            this.fetchReplies(postType, comment.id, postId);
          });
        },
        error => {
          console.error('Error fetching comments:', error);
        }
      );
    }
    
    fetchReplies(postType: 'video' | 'article' | 'image', commentId: number, postId: number) {
      this.fusionService.getReplies(postType, commentId, postId).subscribe(
        (serviceReplies: any[]) => {
          // Sort replies by timestamp in ascending order, then reverse
          serviceReplies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          serviceReplies.reverse();
    
          this.replies[commentId] = serviceReplies.map(reply => this.mapServiceCommentToComment(reply));
    
          // Update the replies for the specific comment
          const commentIndex = this.comments[postId].findIndex(c => c.id === commentId);
          if (commentIndex !== -1) {
            this.comments[postId][commentIndex].replies = this.replies[commentId];
            // Trigger change detection
            this.comments[postId] = [...this.comments[postId]];
          }
        },
        (error) => {
          console.error('Error fetching replies:', error);
        }
      );
    }
    
   
     private mapServiceCommentToComment(serviceComment: any): Comment {
       return {
         id: serviceComment.id || 0,
         commentDate:serviceComment.commentDate,
         text: serviceComment.text || '',
         postId:serviceComment.postId,
         timestamp: serviceComment.timestamp || '',
         profileImage: serviceComment.user?.profileImage || 'default-profile-image-url',
         userImage: serviceComment.user?.userImage || 'default-user-image-url',
         user: {
          id:serviceComment.user?.id,
          profession:serviceComment.user?.profession,
           profileImage:serviceComment.user?.profileImage,  // Adjusted to accept SafeUrl
           userImage:serviceComment.user?.userImage,  // Adjusted to accept SafeUrl
    
           name: serviceComment.user?.name || 'Unknown User'
         },
         content: serviceComment.content || '',
         videoCommentContent: serviceComment.videoCommentContent || '',
         createdAt: serviceComment.createdAt || '',
         // Add any other properties that are part of your Comment interface
       };
     }
     getAvatarBackgroundImage(user: any): string {
       console.log('User object:', user);
       if (user && user.userImage) {
         console.log('User image:', user.userImage);
         // The userImage seems to be a base64 string without the data URL prefix
         return `url(data:image/jpeg;base64,${user.userImage})`;
       }
       console.log('No user image found');
       return 'none';
     }
    
     likeComment(postId: number, commentId: number): void {
       const post = this.combinedPosts.find(p => p.id === postId);
       if (!post) {
         console.error('Post not found');
         return;
       }
    
       const comment = this.comments[postId]?.find(c => c.id === commentId);
    
       if (comment) {
         this.fusionService.likeComment(post.type, postId, commentId,this.userId).subscribe(
           (response: any) => {
             comment.liked = !comment.liked;
             comment.likes = comment.liked ? (comment.likes || 0) + 1 : Math.max((comment.likes || 0) - 1, 0);
           },
           (error) => {
             console.error('Error liking comment:', error);
           }
         );
       }
     }
    
     likeReply(postId: number, commentId: number, replyId: number): void {
       const post = this.combinedPosts.find(p => p.id === postId);
       if (!post) {
         console.error('Post not found');
         return;
       }
    
       const reply = this.replies[commentId]?.find(r => r.id === replyId);
       if (reply) {
    
         this.fusionService.likeReply(post.type, postId, commentId, replyId,this.userId).
        
         subscribe(
          
           (response: any) => {
             reply.liked = !reply.liked;
             reply.likes = reply.liked ? (reply.likes || 0) + 1 : Math.max((reply.likes || 0) - 1, 0);
           },
           (error) => {
             console.error('Error liking reply:', error);
           }
         );
       }
     }
    
    // Example method in your component to fetch replies


    
     onDeleteComment(type: 'video' | 'article' | 'image', postId: number, commentId: number): void {
       this.fusionService.deleteComment(type, postId, commentId).subscribe(
         () => {
           console.log('Comment deleted successfully');
           // Update your UI accordingly
           // this.comments = this.comments.filter(comment => comment.id !== commentId);
         },
         error => {
           console.error('Error deleting comment:', error);
         }
       );
     }
    
    
     fetchRepliesShorts(parentCommentId: number,postId:number,userId:number): void {
      this.fusionService.performShortVideoAction('getReplies', postId, userId, undefined, undefined, parentCommentId)
        .subscribe(
          (replies) => {
            console.log('Nested comments:', replies);
            // Handle the fetched replies (e.g., display them in the UI)
          },
          (error) => {
            console.error('Error fetching nested comments:', error);
          }
        );
    }
    
    
    
     

    
    
     ngAfterViewInit(): void { }
    
     getVideos(): Observable<any[]> {
      return this.fusionService.getAllLongVideos().pipe(
        map(data => data.map(video => this.transformToVideoFormat(video, 'video')))
        
      );
      
    }
    
    getImages(): Observable<any[]> {
      return this.fusionService.getAllImagePosts().pipe(
        map(data => data.map(image => this.transformToVideoFormat(image, 'image')))
      );
      
    }
    
    getArticles(): Observable<any[]> {
      return this.fusionService.getAllArticlePosts().pipe(
        map(data => data.map(article => this.transformToVideoFormat(article, 'article')))
      );
    }
     updateCombinedPosts(): void {
       this.combinedPosts = [...this.videos, ...this.images, ...this.articles];
    
     }
    
     handleImageError(event: any) {
      event.target.src = '../../assets/download.png'; // Ensure this path is correct
      console.error('Image failed to load:', event.target.src);
     }
    
    
     loadAllPosts2(page: number = 1, pageSize: number = 3): void {  
      console.log('FeedComponent loadAllPosts', { page, pageSize });  
      this.loading = true;  
      this.error = null;  
      this.currentPage++;  
    
      forkJoin({  
        videos: this.getVideos(),  
        images: this.getImages(),  
        articles: this.getArticles()  
      }).subscribe({  
        next: (result) => {  
          console.log('FeedComponent loadAllPosts next', result);  
          this.combinedPosts = [  
            ...this.combinedPosts,  
            ...result.videos.map(post => ({ ...post, type: 'video', isVideo: true })),  
            ...result.images.map(post => ({ ...post, type: 'image', isImage: true })),  
            ...result.articles.map(post => ({ ...post, type: 'article', isArticle: true }))  
          ];  
    
          // Sort the combined posts by timestamp  
          this.combinedPosts.sort((a, b) => {  
            const dateA = new Date(a.timestamp || a.createdAt);  
            const dateB = new Date(b.timestamp || b.createdAt);  
            return dateB.getTime() - dateA.getTime();  
          });  
    
          this.updateSavedStatus(this.combinedPosts);  
          this.combinedPosts.forEach(post => this.checkLikeStatus(post));  
          this.displayedPosts = this.combinedPosts.slice((page - 1) * pageSize, page * pageSize);  
    
          this.currentPage = page;  
          this.hasMorePosts = this.combinedPosts.length > page * pageSize;  
    
          this.loading = false;  
        },  
        error: (error) => {  
          console.error('FeedComponent loadAllPosts error:', error);  
          this.loading = false;  
        }  
      });  
    }  
    
   
    
    
    
    
    
    
    
    
    
    
    
    
    
     fetchCommentCount(postId: number): void {
       this.fusionService.getCommentCount1(postId).subscribe(
         (count: number) => {
           this.commentCount = count;
         },
         (error: any) => {
           console.error('Error fetching comment count:', error);
         }
       );
     }
     shareShort1(short: { src: string }) {
       if (navigator.share) {
         navigator.share({
           title: 'Check out this video',
           url: short.src
         }).then(() => {
           console.log('Thanks for sharing!');
         }).catch(console.error);
       } else {
    
         console.log('Share API is not supported in your browser.');
       }
     }
    
    
    
     toggleSave(postId: number): void {
       const post = this.videos.find(video => video.id === postId);
       if (post) {
         post.saved = !post.saved;
       } else {
         console.error('Post not found');
       }
     }
    
     toggleShareMenu(postId: number): void {
       const post = this.videos.find(video => video.id === postId);
       if (post) {
         post.showShareMenu = !post.showShareMenu;
       } else {
         console.error('Post not found');
       }
     }
    
     toggleShareModal(postId: number): void {
       const post = this.videos.find(video => video.id === postId);
       if (post) {
         post.showShareModal = !post.showShareModal;
       } else {
         console.error('Post not found');
       }
     }
    
    
    
    
     openShortsFullScreen(): void {
       this.isShortsFullScreen = true;
       this.pauseAndMuteAllVideos();
       setTimeout(() => {
         this.playCurrentShort(0);
         const videoElements = Array.from(document.querySelectorAll('.shorts-full-screen video')) as HTMLVideoElement[];
         videoElements.forEach(video => {
           video.addEventListener('play', () => this.pauseOtherVideos(video));
         });
       });
     }
    
     exitShortsFullScreen(): void {
       this.isShortsFullScreen = false;
       setTimeout(() => {
         const videoElements = Array.from(document.querySelectorAll('.shorts-full-screen video')) as HTMLVideoElement[];
         videoElements.forEach(video => {
           video.pause();
           video.muted = false;
         });
       });
       this.unmuteAllVideos();
     }
    
     private playCurrentShort(index: number): void {
       const videoElements = Array.from(document.querySelectorAll('.shorts-full-screen video')) as HTMLVideoElement[];
       if (videoElements[index]) {
         videoElements[index].play();
       }
     }
     private pauseOtherVideos(currentVideo: HTMLVideoElement): void {
       const allVideos = Array.from(document.querySelectorAll('video'));
       allVideos.forEach(video => {
         if (video !== currentVideo) {
           video.pause();
         }
       });
     }
    
     private pauseAndMuteAllVideos(): void {
       const allVideos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
       allVideos.forEach(video => {
         video.pause();
         video.muted = true;
       });
     }
    
     onVideoPlay(event: Event): void {
       const currentVideo = event.target as HTMLVideoElement;
       this.pauseOtherVideos(currentVideo);
     }
    
     private unmuteAllVideos(): void {
       const allVideos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
       allVideos.forEach(video => {
         video.pause();
         video.muted = false;
       });
     }
    
     private addPlayEventListeners(): void {
       const allVideos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
       allVideos.forEach(video => {
         video.addEventListener('play', () => this.pauseOtherVideos(video));
       });
     }
    
     startLiveVideo() {
       this.showLiveVideo = true;
       navigator.mediaDevices.getUserMedia({ video: true })
         .then(stream => {
           this.mediaStream = stream;
           this.liveVideo.nativeElement.srcObject = stream;
         })
         .catch(error => console.error('Error accessing camera:', error));
     }
    
     stopLiveVideo() {
       if (this.mediaStream) {
         this.mediaStream.getTracks().forEach(track => track.stop());
       }
       this.showLiveVideo = false;
     }
    
     openMediaOptions() {
       this.showMediaOptions = true;
     }
    
     closeMediaOptions() {
       this.showMediaOptions = false;
     }
     closeOtherModals() {
      // Close photo options modal if open
      if (this.showPhotoOptionsModal) {
        this.closePhotoOptions();
      }
    
      // Stop the camera if it's active
      if (this.showCamera) {
        this.stopCamera();
      }
    
      // Reset captured image if there's one
      if (this.capturedImage) {
        this.capturedImage = null;
      }
    }
    
    
     startCamera() {
      this.closeOtherModals();  // Ensure no other modals are open before starting the camera
      this.showPhotoOptionsModal = false; // Close the photo options modal
         this.showCamera = true; // Show the camera interface
         navigator.mediaDevices.getUserMedia({ video: true })
             .then(stream => {
                 this.mediaStream = stream;
                 this.liveVideo.nativeElement.srcObject = stream;
             })
             .catch(error => {
                 console.error('Error accessing camera:', error);
                 // Optionally, show an error message to the user
             });
     }
      
      
      
    
    
     handleCapturedPhoto(file: File) {
       const reader = new FileReader();
       reader.onload = (e: any) => {
         this.capturedImage = e.target.result;
         this.newPost.image = e.target.result;
         this.newPost.video = null;
       };
       reader.readAsDataURL(file);
     }
    
    
     stopCamera() {
       if (this.mediaStream) {
         this.mediaStream.getTracks().forEach(track => track.stop());
       }
       this.showCamera = false;
     }
    // =============================================SHORTS=============================================================
    
    

    likeShort(postId: number, userId: number) {
      this.fusionService.performShortVideoAction('like', postId, userId).subscribe(
        response => {
          // Update the UI here
          const short = this.reorderedShorts.find(s => s.id === postId);
          if (short) {
            short.liked = !short.liked;
            short.likes += short.liked ? 1 : -1;
          }
        },
        error => console.error('Error liking short:', error)
      );
    }
    shareShort(postId: number, userId: number) {
      const post = this.reorderedShorts.find(p => p.id === postId);
      if (!post) {
        console.error(`Post with id ${postId} not found`);
        return;
      }
    
      if (navigator.share) {
        navigator.share({
          title: `Check out this short video`,
          url: post.url
        }).then(() => {
          console.log('Content shared successfully');
          this.fusionService.performShortVideoAction('share', postId, userId).subscribe(
            response => {
              console.log('Share count incremented successfully');
              post.shares++;
            },
            error => {
              console.error('Error incrementing share count:', error);
            }
          );
        }).catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Error sharing content:', error);
          } else {
            console.log('Share dialog was closed without sharing');
          }
        });
      } else {
        console.log('Web Share API is not supported in your browser.');
      }
    }
    
    
    
    addCommentToShorts(postId: number, userId: number, commentText: string) {
      // Find the post in the reorderedShorts array
      const post = this.reorderedShorts.find(p => p.id === postId);
      if (!post) {
        console.error(`Post with id ${postId} not found`);
        return;
      }
    
      // Make an API call to add the comment
      this.fusionService.performShortVideoAction('comment', postId, userId, commentText).subscribe(
        response => {
          console.log('Comment added successfully', response);
          
          // Ensure the comments array for this post exists
          if (!this.comments[postId]) {
            this.comments[postId] = [];
          }
    
          // Add the new comment at the beginning of the array (unshift)
          this.comments[postId].unshift(response);
    
          // Trigger change detection by creating a new array reference
          this.comments[postId] = [...this.comments[postId]];
        },
        error => console.error('Error adding comment:', error)
      );
    }
    
    
likeCommentShort(postId: number, commentId: string, userId: number) {
  this.fusionService.performShortVideoAction('likeComment', postId, userId, commentId ).subscribe(
    response => {
      console.log('Comment liked successfully');
      const comment = this.comments[postId].find(c => c.id === commentId);
      if (comment) {
        comment.liked = !comment.liked;
        comment.likes += comment.liked ? 1 : -1;
      }
    },
    error => console.error('Error liking comment:', error)
  );
}
  
  
  

openCommentSection(shortId: number) {
  this.openCommentId = shortId;
}

// Method to close the comment section
closeCommentSection() {
  this.openCommentId = null;
}

// Method to check if the comment section is open
isCommentSectionOpen(shortId: number): boolean {
  return this.openCommentId === shortId;
}


fetchCommentsShort(postId: number, userId: number) {
  this.fusionService.performShortVideoAction('getComments', postId, userId).subscribe({
    next: (comments: any[]) => {
      // Sort comments by timestamp in ascending order, then reverse
      this.comments[postId] = this.sortCommentsByTimestamp(comments.map(comment => ({
        ...comment,
        replies: [],
        showReply: false
      }))).reverse();

      // Fetch replies for each comment
      this.comments[postId].forEach(comment => {
        this.getNestedComments(postId, comment.id);
      });
    },
    error: (error) => console.error('Error fetching comments:', error)
  });
}

// Helper function to sort comments
private sortCommentsByTimestamp(comments: any[]): any[] {
  return comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}


    openComments(postId: number): void {
      const post = this.reorderedShorts.find(p => p.id === postId);
      if (!post) {
        console.error(`Post with id ${postId} not found`);
        return;
      }
    
      post.showComments = !post.showComments;
      if (post.showComments && !this.comments[postId]) {
        this.fetchCommentsShort(postId,this.userId);
      }
    }

    addNestedComment(parentCommentId: number, userId: number): void {
      // Get the content of the reply and trim it
      const content = this.replyContent[parentCommentId];
      if (!content || !content.trim()) {
        return;
      }
    
      // Make an API call to add the nested comment
      this.fusionService.addNestedComment(parentCommentId, userId, content)
        .subscribe({
          next: (nestedComment: any) => {
            console.log('Nested comment added successfully:', nestedComment);
            
            // Iterate through the comments to find the parent comment
            for (let shortId in this.comments) {
              const parentComment = this.comments[shortId].find(c => c.id === parentCommentId);
              if (parentComment) {
                // Initialize the replies array if it doesn't exist
                if (!parentComment.replies) {
                  parentComment.replies = [];
                }
                
                // Add the new nested comment at the beginning of the replies array (unshift)
                parentComment.replies.unshift(nestedComment);
    
                // Clear the reply input for the parent comment
                this.replyContent[parentCommentId] = '';
                
                // Hide the reply section after adding the comment
                parentComment.showReply = false;
    
                // Trigger change detection by creating a new array reference
                this.comments[shortId] = [...this.comments[shortId]];
                break;
              }
            }
          },
          error: (error) => {
            if (error.status === 404) {
              console.error('User not found');
              // Handle user not found error
            } else {
              console.error('Error adding nested comment:', error);
              // Handle other errors
            }
          }
        });
    }
    

    // Helper method to find a comment by its ID
    private findCommentById(shortId: number, commentId: number): any {
      const short = this.shorts.find(s => s.id === shortId);
      if (short && short.comments) {
        return short.comments.find((c: { id: number; }) => c.id === commentId);
      }
      return null;
    }


    likeCommentShorts(videoId: number, comment: any, userId: number): void {
      // Toggle the liked status locally
      const previouslyLiked = comment.liked;
      comment.liked = !comment.liked;
    
      // Update the likes count locally
      comment.likes += comment.liked ? 1 : -1;
    
      // Call the service to like or unlike the comment
      this.fusionService.likeCommentshort(videoId, comment.id, userId)
        .subscribe({
          next: (likedComment: any) => {
            console.log('Comment liked/unliked successfully:', likedComment);
            // The UI has already been updated optimistically, so no further action is needed
          },
          error: (error) => {
            // Revert the optimistic update in case of an error
            comment.liked = previouslyLiked;
            comment.likes += comment.liked ? -1 : 1;
    
            if (error.status === 404) {
              console.error('User not found');
              // Handle user not found error
            } else {
              console.error('Error liking/unliking comment:', error);
              // Handle other errors
            }
          }
        });
    }
    
    getNestedComments(postId: number, parentCommentId: number) {
      this.fusionService.getNestedComments(parentCommentId).subscribe({
        next: (nestedComments) => {
          // Sort nested comments by timestamp in ascending order, then reverse
          const sortedNestedComments = this.sortCommentsByTimestamp(nestedComments.map(reply => ({
            ...reply,
            liked: false
          }))).reverse();
    
          // Find the parent comment and update its replies
          const commentIndex = this.comments[postId].findIndex(c => c.id === parentCommentId);
          if (commentIndex !== -1) {
            this.comments[postId][commentIndex].replies = sortedNestedComments;
            // Trigger change detection
            this.comments[postId] = [...this.comments[postId]];
          }
        },
        error: (error) => {
          console.error('Error fetching nested comments:', error);
        }
      });
    }
  likeNestedComment(shortId: number, commentId: number, replyId: number, userId: number) {
    this.fusionService.likeNestedComment(replyId, userId).subscribe({
      next: (updatedReply: Reply) => {
        const commentsForShort = this.comments[shortId];
        if (commentsForShort) {
          const comment = commentsForShort.find((c: Comment) => c.id === commentId);
          if (comment) {
            const replyIndex = comment.replies.findIndex((r: Reply) => r.id === replyId);
            if (replyIndex !== -1) {
              comment.replies[replyIndex] = updatedReply;
            }
          }
        }
      },
      error: (error: any) => {
        console.error('Error liking nested comment:', error);
        // Handle error (e.g., show a notification to the user)
      }
    });
  }

  checkLikeStatus(post: any) {
    this.fusionService.isPostLikedByUser(post.id, this.userId, post.type).subscribe(
      isLiked => {
        post.liked = isLiked;
      },
      error => console.error('Error checking like status:', error)
    );
  }

  checkLikeStatusShort(short: any) {
    this.fusionService.isShortVideoLikedByUser(short.id, this.userId).subscribe(
      isLiked => {
        short.liked = isLiked;
      },
      error => console.error('Error checking like status:', error)
    );
  }
  
    // private updateCommentInUI(likedComment: number): void {
    //   // Find the comment in your local data structure and update it
    //   // This will depend on how you're storing comments in your component
    //   // For example:
    //   const video = this.videos.find(v => v.id === likedComment.videoId);
    //   if (video) {
    //     const commentIndex = video.comments.findIndex(c => c.id=== likedComment.id);
    //     if (commentIndex !== -1) {
    //       video.comments[commentIndex] = likedComment;
    //     }
    //   }

    deleteComment(post: any, comment: any) {
      const userId = this.userId; // Implement this method to get the current user's ID
      let observable;
  
      if (post.type === 'article') {
        observable = this.fusionService.deleteArticleComment(post.id, comment.id, userId);
      } else if (post.type === 'image') {
        observable = this.fusionService.deleteImageComment(post.id, comment.id, userId);
      } else if (post.type === 'video') {
        observable = this.fusionService.deleteVideoComment(post.id, comment.id, userId);
      } else {
        console.error('Unknown post type');
        return;
      }
  
      observable.subscribe({
        next: () => {
          // Remove the comment from the local array
          const index = this.comments[post.id].findIndex(c => c.id === comment.id);
          if (index !== -1) {
            this.comments[post.id].splice(index, 1);
            // Trigger change detection
            this.comments[post.id] = [...this.comments[post.id]];
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            console.error('Comment not found');
          } else if (error.status === 403) {
            console.error('Unauthorized to delete this comment');
          } else {
            console.error('Error deleting comment:', error.message);
          }
        }
      });
    }
    
    deleteNestedComment(postId: number, commentId: number, replyId: number) {
      const userId = this.userId; // Implement this method to get the current user's ID
  
      this.fusionService.deleteNestedCommentWithUserId(replyId, userId).subscribe({
        next: () => {
          // Remove the nested comment from the local array
          const replyIndex = this.replies[commentId].findIndex(r => r.id === replyId);
          if (replyIndex !== -1) {
            this.replies[commentId].splice(replyIndex, 1);
            // Trigger change detection
            this.replies[commentId] = [...this.replies[commentId]];
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 403) {
            console.error('Unauthorized to delete this nested comment');
          } else {
            console.error('Error deleting nested comment:', error.message);
          }
        }
      });
    }
  
    deleteCommentShorts(videoId: number, commentId: number) {
      const userId = this.userId; // Implement this method to get the current user's ID
  
      this.fusionService.deleteCommentShorts(videoId, commentId, userId).subscribe({
        next: (response) => {
          console.log(response);
          // Remove the comment from the local array
          if (this.comments[videoId]) {
            this.comments[videoId] = this.comments[videoId].filter(c => c.id !== commentId);
            // Trigger change detection
            this.comments = { ...this.comments };
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            console.error('Comment not found');
          } else if (error.status === 403) {
            console.error('Unauthorized to delete this comment');
          } else {
            console.error('Error deleting comment:', error.message);
          }
        }
      });
    }
  
    deleteNestedCommentShorts(videoId: number, commentId: number, nestedCommentId: number) {
      this.fusionService.deleteNestedCommentShorts(nestedCommentId).subscribe({
        next: (response) => {
          console.log(response);
          // Remove the nested comment from the local array
          if (this.comments[videoId]) {
            const commentIndex = this.comments[videoId].findIndex(c => c.id === commentId);
            if (commentIndex !== -1) {
              this.comments[videoId][commentIndex].replies = 
                this.comments[videoId][commentIndex].replies.filter((r: { id: number; }) => r.id !== nestedCommentId);
              // Trigger change detection
              this.comments = { ...this.comments };
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error deleting nested comment:', error.message);
        }
      });
    }



    startEditing(comment: any) {
      this.editingComment[comment.id] = true;
      this.editContent[comment.id] = comment.text || comment.videoCommentContent;
    }
  
    cancelEditing(comment: any) {
      this.editingComment[comment.id] = false;
      delete this.editContent[comment.id];
    }
  
    editComment(postType: string, postId: number, comment: any) {
      const userId = this.userId;
      const newContent = this.editContent[comment.id];
    
      if (!newContent || newContent.trim().length === 0) {
        console.error('Comment content cannot be empty');
        return;
      }
    
      this.fusionService.editComment(postType, postId, comment.id, userId, newContent,).subscribe({
        next: (updatedComment) => {
          // Update the comment in the local array
          const commentIndex = this.comments[postId].findIndex(c => c.id === comment.id);
          if (commentIndex !== -1) {
            this.comments[postId][commentIndex] = { ...updatedComment, user: comment.user };
            // Trigger change detection
            this.comments = { ...this.comments };
          }
          this.editingComment[comment.id] = false;
          delete this.editContent[comment.id];
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized to edit this comment');
          } else if (error.status === 404) {
            console.error('Comment not found');
          } else {
            console.error('Error editing comment:', error.message);
          }
        }
      });
    }


    startEditingNested(nestedComment: any) {
      this.editingNestedComment[nestedComment.id] = true;
      this.editNestedContent[nestedComment.id] = nestedComment.content || nestedComment.text;
    }
  
    cancelEditingNested(nestedComment: any) {
      this.editingNestedComment[nestedComment.id] = false;
      delete this.editNestedContent[nestedComment.id];
    }
  
    editNestedComment(postId: number, commentId: number, nestedComment: any, isVideo: boolean = false) {
      const userId = this.userId; // Implement this method to get the current user's ID
      const newContent = this.editNestedContent[nestedComment.id];
  
      if (!newContent || newContent.trim().length === 0) {
        console.error('Nested comment content cannot be empty');
        return;
      }
  
      const editObservable = isVideo
        ? this.fusionService.editVideoNestedComment(nestedComment.id, userId, newContent)
        : this.fusionService.editNestedComment(nestedComment.id, userId, newContent);
  
      editObservable.subscribe({
        next: (updatedNestedComment) => {
          // Update the nested comment in the local array
          const commentIndex = this.comments[postId].findIndex(c => c.id === commentId);
          if (commentIndex !== -1) {
            const nestedCommentIndex = this.comments[postId][commentIndex].replies.findIndex((r: { id: any; }) => r.id === nestedComment.id);
            if (nestedCommentIndex !== -1) {
              this.comments[postId][commentIndex].replies[nestedCommentIndex] = { ...updatedNestedComment, user: nestedComment.user };
              // Trigger change detection
              this.comments = { ...this.comments };
            }
          }
          this.editingNestedComment[nestedComment.id] = false;
          delete this.editNestedContent[nestedComment.id];
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized to edit this nested comment');
          } else if (error.status === 404) {
            console.error('Nested comment not found');
          } else if (error.status === 400) {
            console.error('Bad request: ' + error.error);
          } else {
            console.error('Error editing nested comment:', error.message);
          }
        }
      });
    }
    
    editCommentOrNestedComment(postId: number, commentId: number, nestedComment: any = null, isVideo: boolean = false) {
      const userId = this.userId; // Get the current user's ID
      const newContent = nestedComment 
        ? this.editNestedContent[nestedComment.id] 
        : this.editContent[commentId];
    
      if (!newContent || newContent.trim().length === 0) {
        console.error('Comment content cannot be empty');
        return;
      }
    
      const editObservable = nestedComment
        ? this.fusionService.editVideoNestedCommentShort(nestedComment.id, userId, newContent)
        : this.fusionService.editVideoCommentShort(postId, commentId, userId, newContent);
    
      editObservable.subscribe({
        next: (updatedComment) => {
          if (nestedComment) {
            // Handle the nested comment update
            const commentIndex = this.comments[postId].findIndex(c => c.id === commentId);
            if (commentIndex !== -1) {
              const nestedCommentIndex = this.comments[postId][commentIndex].replies.findIndex((r: { id: any; }) => r.id === nestedComment.id);
              if (nestedCommentIndex !== -1) {
                this.comments[postId][commentIndex].replies[nestedCommentIndex] = { ...updatedComment, user: nestedComment.user };
              }
            }
          } else {
            // Handle the main comment update
            const commentIndex = this.comments[postId].findIndex(c => c.id === commentId);
            if (commentIndex !== -1) {
              this.comments[postId][commentIndex] = { ...updatedComment, user: this.comments[postId][commentIndex].user };
            }
          }
    
          // Trigger change detection
          this.comments = { ...this.comments };
    
          // Reset editing states
          if (nestedComment) {
            this.editingNestedComment[nestedComment.id] = false;
            delete this.editNestedContent[nestedComment.id];
          } else {
            this.editingComment[commentId] = false;
            delete this.editContent[commentId];
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Unauthorized to edit this comment');
          } else if (error.status === 404) {
            console.error('Comment not found');
          } else if (error.status === 400) {
            console.error('Bad request: ' + error.error);
          } else {
            console.error('Error editing comment:', error.message);
          }
        }
      });
    }
    









    
  
    
     navigateToSavedItems(): void {
      const id = this.authService.getId();
      if (id) {
        this.router.navigate(['/profile', id], { queryParams: { tab: 'SavedItems' } });
      } else {
        // If no ID is available, navigate to the general profile page with the SavedItems tab
        this.router.navigate(['/profile'], { queryParams: { tab: 'SavedItems' } });
      }
    }
      navigateToProfile(): void {
        const id = this.authService.getId();
        if (id) {
          this.router.navigate([`/profile/${id}`]);
        } else {
          console.error('User ID not found. Unable to navigate to profile.');
        }
      }
      // navigateToProfile(): void {
      //   const id = 2; // Hardcoding the ID to 1 as per your request
      //   this.router.navigate(['/usersprofile', id]);
      // }
     navigateToSuggestionsTab() {
       // Replace '123' with the actual userId or dynamically fetch userId
       const userId = '123';
       this.router.navigate(['/profile', userId], { fragment: 'Suggestions' });
     }
     navigateToCourseDashboard(){
       this.router.navigate(['/candidateview'])
    
     }
     navigateToUserProfile(userId: number): void {
      if (userId) {
        this.router.navigate(['/usersprofile', userId]);
      } else {
        console.error('User ID is not available');
      }
    }
    navigateToUserProfileForSuggestions(userId: number): void {
      if (userId) {
        this.router.navigate(['/usersprofile', userId]);
      } else {
        console.error('User ID is not available');
      }
    }

    getAIRecommendations(): Observable<any[]> {
      const userId = this.getUserId();
     
      if (userId === 0) {
        console.error('Cannot fetch AI recommendations without a valid user ID');
        return of([]);
      }
   
      const body = { user_id: userId };
      return this.http.post<any[]>(`${this.apiBaseUrl}/feedRecommendations`, body).pipe(
        tap(response => console.log('Raw API response:', response)), // Add this line for debugging
        map(response => this.transformRecommendations(response)),
        catchError(error => {
          console.error('Error fetching recommendations:', error);
          return of([]);
        })
      );
    }
   
    private transformRecommendations(recommendations: any[]): any[] {
      console.log('transformRecommendations input:', recommendations); // Add this line for debugging
   
      if (!Array.isArray(recommendations)) {
        console.error('transformRecommendations received non-array input:', recommendations);
        return [];
      }
   
      return recommendations.map(post => {
        if (!post) {
          console.warn('Encountered null or undefined post in recommendations');
          return null;
        }
   
        let type: 'video' | 'image' | 'article';
        switch (post.type) {
          case 'long_video':
            type = 'video';
            break;
          case 'image_post':
            type = 'image';
            break;
          case 'article_post':
            type = 'article';
            break;
          default:
            console.warn(`Unknown post type: ${post.type}. Defaulting to 'article'`);
            type = 'article';
        }
   
        const mergedPost = {
          ...post,
          ...(post.videoDetails || {}),
          ...(post.imageDetails || {}),
          ...(post.articleDetails || {})
        };
   
        return this.transformToVideoFormat(mergedPost, type);
      }).filter(post => post !== null); // Remove any null posts
    }
    loadAllPosts1(): void {  
      this.loading = true;  
      this.error = null;  
    
      this.getAIRecommendations().pipe(  
        catchError(error => {  
          console.error('Error in getAIRecommendations:', error);  
          this.loading = false;  
          this.loadAllPosts2();  
          return of([]);  
        })  
      ).subscribe({  
        next: (recommendations) => {  
          if (recommendations.length === 0) {  
            this.error = 'No recommendations available. Please try again later.';  
            this.loadAllPosts2();  
          } else {  
            this.combinedPosts = recommendations;  
          }  
          this.loading = false;  
        },  
        error: (error) => {  
          console.error('Error in loadAllPosts:', error);  
          this.error = 'Failed to load recommendations. Please try again later.';  
          this.loading = false;  
          this.loadAllPosts2();  
        }  
      });  
    }  
    
    
   loadSpecificPost(url: string): void {
    if (!url) {
      console.error('Invalid URL provided');
      return;
    }
 
    this.isloading = true;
 
    this.fusionService.getPostByUrl(url).subscribe(
      (post: any) => {
        const contentType = this.determineContentType(post);
        this.specificPost = this.transformToPostFormat(post, contentType);
        this.showSpecificPost = true;
        this.isloading = false;

        setTimeout(() => {
          const element = document.getElementById('specific-post');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      
      },
      error => {
        console.error('Error fetching specific post:', error);
        this.isloading = false;
        this.errorMessage = 'Failed to load the post. Please try again later.';
      }
    );
  }
 
  determineContentType(post: any): 'video' | 'image' | 'article' {
    if (post.longVideoTitle || post.longVideoDescription || post.s3Url) {
      return 'video';
    } else if (post.photo || post.isImage) {
      return 'image';
    } else {
      return 'article';
    }
  }

  specificPostToggleComments(postId: number, postType: 'video' | 'article' | 'image'): void {
    if (this.specificPost && this.specificPost.id === postId && this.specificPost.type === postType) {
      this.specificPost.showComments = !this.specificPost.showComments;
      if (this.specificPost.showComments && !this.comments[postId]) {
        this.fetchComments(postType, postId);
      }
    } else {
      console.error('Specific post not found or mismatch');
    }
  }
  
  transformToPostFormat(item: any, contentType: 'video' | 'image' | 'article') {
    let content = '';
    let src = '';
    let likes = 0;
    let shares = 0;
    let views = 0; 
    let tag ='';
 
    if (contentType === 'article') {
      content = item.article || '';
      likes = item.articleLikeCount || 0;
      shares = item.articleShareCount || 0;
      tag = item.tag || '',
      this.comments
    } else if (contentType === 'image') {
      content = item.imageDescription || '';
      src = `data:image/jpeg;base64,${item.photo}`;
      likes = item.imageLikeCount || 0;
      shares = item.imageShareCount || 0;
      tag = item.tag || ''

      
    } else if (contentType === 'video') {
      content = item.longVideoDescription || '';
      src = item.s3Url;
      likes = item.longVideoLikes || 0;
      shares = item.longVideoShares || 0;
      views = item.longVideoViews || 0;
      tag = item.tag
 
    }

    let mappedComments: any[] = [];
    
    try {
      mappedComments = Array.isArray(item.videoCommentContent) ?
        item.videoCommentContent.map((comment: any) => ({
          id: comment.id,
          content: comment.videoCommentContent || '',
          author: comment.user?.name || 'Unknown Author',
        createdAt: new Date(comment.createdAt).toISOString(),  
        })) :
        [];
    } catch (error) {
      console.error('Error mapping comments:', error);
    }
 
    return {
      id: item.id || '',
      profileImage: item.user?.userImage || '',
      profileName: item.user?.name || 'Unknown User',
      timestamp: item.postDate || item.createdAt || new Date(),
      content: content,
      isVideo: contentType === 'video',
      isImage: contentType === 'image',
      isArticle: contentType === 'article',
      src: src,
      likes: likes,
      shares: shares,
      saved: false,
      liked: likes,
      showComments: false,
     comments: mappedComments,
      type: contentType,
      views:views,
      tag:item.tag,
      url: item.url || '',
      title: item.title || '',
      text: item.text || '',
      createdAt: item.postDate || item.createdAt || new Date(),
      videoCommentContent: item.videoCommentContent || '',
      commentDate: item.commentDate || new Date(),
      longVideoLikes: item.longVideoLikes || 0,
      longVideoShares: item.longVideoShares || 0,
      longVideoViews: item.longtVideoViews || 0,
    };
  }
   
  navigateToCombinedPosts(){
    this.showSpecificPost = false;
    this.specificPost = null;
    this.router.navigate(['/feed']);
  }
  onScroll(event: any): void {  
    console.log('FeedComponent onScroll', event);  
    const scrollHeight = event.target.scrollHeight;  
    const scrollTop = event.target.scrollTop;  
    const clientHeight = event.target.clientHeight;  
  
    if ((scrollTop + clientHeight) >= scrollHeight && !this.loading && this.hasMorePosts) {  
      this.loadAllPosts2(this.currentPage + 1, this.pageSize);  
    }  
  } 
  
// ----------------------------------------------personal details
  checkUserDetails() {
    this.http.get(`${this.apiBaseUrl}/personalDetails/${this.userId}`).subscribe({
      next: (details: any) => {
        if (!details.isProfileComplete) {
          this.showUserDetailsPopup = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching user details:', error);
        // Optionally handle the error, maybe show the popup anyway
        this.showUserDetailsPopup = true;
      }
    });
  }

  closePopup(): void {
    this.showUserDetailsPopup = false;
    if (this.showUserDetailsPopup) {
      this.router.navigate(['/profile-sett']);
    }
  }

  navigateToUserDetails() {
    this.router.navigate(['/profile-sett']);
  }


}