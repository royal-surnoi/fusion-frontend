 
// // import { CommonModule } from '@angular/common';
// // import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
// // import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
 
// // import { FusionService } from '../fusion.service';
// // import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// // import { BehaviorSubject, Observable, catchError, forkJoin, map, of } from 'rxjs';
// // import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// // import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// // import { formatDistanceToNow, parseISO } from 'date-fns';
// // import { MatSnackBar } from '@angular/material/snack-bar';
// // import { UserService,User } from '../user.service';
// // import { AuthService } from '../auth.service';
// // import { id } from '@swimlane/ngx-charts';
// // import { ViewCountFormatterPipe } from '../view-count-formatter.pipe';
 
// // declare var bootstrap: any; // Declare bootstrap variable to avoid TypeScript errors
// // //  error prasna
// // // export interface User {
// // //   userImage: string;
// // //   profileImage: string | SafeUrl; // Adjusted to accept SafeUrl
 
// // //     id: number;
// // //     name: string;
// // // }

// // interface CombinedPost extends Post {
// //   type:  'image' | 'video' | 'article';
// //   isVideo?: boolean;
// //   isImage?: boolean;
// //   isArticle?: boolean;
// //   normalizedDate?: Date;
// // }
// // interface Group {
// //   id: number;
// //   name: string;
// // }

// // interface Follower {
// //   id: number;
// //   name: string;
// // }
 
 
// // export interface Comment {
// //   profileImage: string | SafeUrl; // Adjusted to accept SafeUrl
// //   content: string;
// //   userImage:string;
// //   id: number;
// //   postId:number;
 
// //   likes?: number;
// //   liked?: boolean;
// //   videoCommentContent:string;
// //   text:string;
// //   user:{
// //     id:number;
// //     profileImage: string | SafeUrl; // Adjusted to accept SafeUrl
// //     userImage: string;
 
// //     name: string;
 
// //   }
// //   commentDate:string;
// //     timestamp:Date;
// //   createdAt: string;
// //   replies?:Comment[];
// // }
// // export interface Video {
// //   id: number;
// //   src: string;
// //   likes: number;
// //   comments: string[];
// //   shortVideoLikes: number;
// //   shortVideoShares: number;
// //   shortVideoViews: number;
// //   description?: string;
// //   createdAt:Date;
// //   profileImage: string | SafeUrl; // Adjusted to accept SafeUrl

// // }
// // export interface short {
// //   profileImage: string | SafeUrl; // Adjusted to accept SafeUrl

// // } 
 
 
 
// // interface Post {
// //   url: string;
// //   type: 'video' | 'article' | 'image';
// //   id: number;
// //   title: string;
// //   src: string;
// //   likes: number;
// //   comments: string[];
// //   shares: number;
// //   content: string;
// //   timestamp: string;
// //   createdAt:string
// //   profileImage: string | SafeUrl; // Adjusted to accept SafeUrl
// //   profileName: string;
// //   isVideo?: boolean;
// //   isArticle?: boolean;
// //   isImage?: boolean;
// //   showComments?: boolean;
// //   liked?: boolean;
// //   showShareMenu?: boolean;
// //   saved?: boolean;
// //   newComment?: string;
// //   normalizedDate?: Date;
// //   views:number;

// //   showShareOptions?: boolean;
// //   showCommentBox?: boolean;
// //   showShareModal?: boolean;
// //   showFullContent?: boolean;
// //   text:string[];
// //   videoCommentContent: string[];
// //   commentDate:string;
// //   shortVideoLikes: number;
// //   shortVideoShares: number;
// //   shortVideoViews: number;
// //   description: string;
// //   uploadFailed?: boolean; // New optional property
// //   commentCount:number;
// // }
// // @Component({
// //   selector: 'app-feed',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
// //   templateUrl: './feed.component.html',
// //   styleUrl: './feed.component.css'
// // })
// // export class FeedComponent implements OnInit, AfterViewInit {
// //   @ViewChild('fileInput') fileInput!: ElementRef;
// //   @ViewChild('liveVideo') liveVideo!: ElementRef;
// //   @ViewChild('photoCanvas') photoCanvas!: ElementRef<HTMLCanvasElement>;
// //   @ViewChild('shortVideoInput') shortVideoInput!: ElementRef<HTMLInputElement>;
// //   @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

// //   private watchedTime: number = 0;
// //   private hasIncrementedView: boolean = false;
// //   post = { title: '', content: '', likes: 0, comments: [], liked: false };
// //   isPostMode:boolean=false;
// //   posts: Post[] = []; // Use the Post interface/type for posts array
// //   newComment: string = '';
// //   newShortVideo: File | null = null;
// //   isShortVideoMode: boolean = false;
// //   shortVideoPreviewUrl: string | null = null;

// //   isPosting:boolean=false;
// //   showPhotoOptionsModal:boolean=false;
// //   shorts: any[] = [];
// //   reorderedShorts: any[] = [];

// //   selectedPostIndex: number | null = null; // Track the selected post index for sharing modal
// //   selectedFile: File | null = null;
// //   userImage: SafeUrl | null = null;
 
// //   images: Post[] = [];
// //   articles: Post[] = [];
// //   combinedPosts: Post[] = [];
// //   videos: Post[] = [];
// //   comments: {[shortId: number]: any[]} = {};
// //   commentCount: number=0;

// // // ==========================================================================================
// // replyingTo: { [commentId: number]: boolean } = {};
// //   newReply: { [commentId: number]: string } = {};
// //   replies: { [commentId: number]: Comment[] } = {};
 
// //   repliesVisible: any = {}; // To track the visibility of replies
 
// //   openCommentId: number | null = null;

 
// // // ==============================================================================================
 
// // //  Laxmiprasanna Kondoju
 
// // userId: any;
// // recommendations: User[] = [];
// // followRequests: User[] = [];
// // name: string | null = '';
// //   user: any = {};
// //   currentUserId: string | null = null;
// //   currentUserName: string | null = null;
// //   followerCount: any;
// //   followingCount: any;
// //   followers: any[] = [];
// //   following: any[] = [];
// //   users$ = this.userService.users$;
// //   currentUser = this.userService.getCurrentUser();
// //   followRequests$: Observable<User[]>;
// //   // followRequests$ = this.userService.followRequests$;
// //   users: User[] = [];
// //   private friendsSubject = new BehaviorSubject<User[]>([]);
// //   friends$ = this.friendsSubject.asObservable();
 
// //   private usersSubject = new BehaviorSubject<User[]>([]);
 
 
 
// //   followerCount$: Observable<number>;
// //   followingCount$: Observable<number>;
// //   followrequest: any;
// //   arr: any;
 
// //   sentFollowRequests: number[] = [];
// //   sentRequestUsers: any[];
// //   cuserId: any;
 
 
// //   showAllSuggestions: boolean = false;
// //   replyContent: { [key: number]: string } = {}; // Store reply content for each comment

 
// //   private lastLoggedTime: number = 0;

 
// // //  ==========================================================================================================
 
// // members = [
// //   {
// //     name: 'John Smith',
// //     profilePic: ''
 
// //   },
// //   {
// //     name: 'Jane Doe',
// //     profilePic: ''
// //   },
// //   // Add more members as needed
// // ];
 
// // suggestedConnections = [
// //   { name: 'Uday', img: 'assets/placeholder-image.jpg' },
// //   { name: 'Uday', img: 'assets/placeholder-image.jpg' },
// //   { name: 'Uday', img: 'assets/placeholder-image.jpg' },
// //   { name: 'uday', img: 'assets/placeholder-image.jpg' }
// // ];
 
// // engageSuggestions = [
// //   ' Join the "Tech Innovators" group',
// //   'Participate in the "Hackathon 2024"',
// //   ' Attend the "Networking Night"',
// //   ' Follow the "AI Trends" page'
// // ];
// //   upcomingEvents = [
// //     {
// //       title: 'Social Media',
// //       date: '18',
// //       month: 'June',
// //       location: 'hyderabad',
// //       moreInfoLink: '#'
// //     },
// //     {
// //       title: 'Deveops engg',
// //       date: '18',
// //       month: 'June',
// //       location: 'Madhapur',
// //       moreInfoLink: '#'
// //     },
// //     {
// //       title: 'Mobile Marketing',
// //       date: '22',
// //       month: 'June',
// //       location: 'hitech city',
// //       moreInfoLink: '#'
// //     }
// //     // Add more events as needed
// //   ];
 
 
 
// //   recentSearches: string[] = [
// //     'Education Technology',
// //     'Online Learning Platforms',
// //     'Educational Psychology',
// //     'Blended Learning Solutions',
// //     'E-Learning Trends',
// //     'Education Policy',
// //     'Virtual Classrooms',
// //     'STEM Education',
// //     'Language Learning Apps',
// //     'Personalized Learning',
// //     'Educational Resources',
// //     'Distance Learning',
// //     'Higher Education',
// //     'K-12 Education'
// //   ];
 
// //   showMore: boolean = false;
 
 
// //   groups: Group[] = [
// //     { id: 1, name: 'Finance Club' },
// //     { id: 2, name: 'Future Trend' },
// //     { id: 3, name: 'Project Manager Commun..' }
// //   ];
// //   showCreateGroupModal = false;
// //   newGroupName = '';
// //   selectedMembers: number[] = [];
// //   subscriptions: any;
 
// //   // followers: Follower[] = [
// //   //   // Populate this with your actual followers data
// //   // ];
 
 
 
 
// //   // Track whether to show additional items
 
// //   // Toggle function for 'View More' button
// //   toggleShowMore() {
// //     this.showMore = !this.showMore;
// //   }
 
 
 
 
 
 
 
 
// //   formattedViewCount: string='';
// //   data: any;
// //   isCommentBoxVisible?: boolean;
// //   commentText: any;
// //   submittedComments: any;
// //   articalCommentCount: any;
// //   ArticalComment: any;
// //   articalComment: any;
// //   articalCommentret: any;
// //   currentComment: any;
// //   imageComment: any;
// //   videoCommentContent: any;
// //   getarticllike: any;
// //   getartcilebyid: any;
// //   articlLike: any;
// //   articleShare: any;
// //   vedioLike: any;
// //   videoId: number = 1;
// //   currentPost: any;
// //   // recommendations: any[] = [
// //   //   {
// //   //     name: 'John Doe',
// //   //     role: 'Software Engineer',
// //   //   },
// //   //   {
// //   //     name: 'Jane Smith',
// //   //     role: 'Product Manager',
// //   //   },
// //   //   {
// //   //     name: 'Alice Johnson',
// //   //     role: 'Designer'
// //   //   },
// //   //   {
// //   //     name: 'Robert Brown',
// //   //     role: 'DevOps Engineer',
// //   //   },
// //   // ]; // Define type as per your backend response
 
 
 
// //   // formatDate(dateString: string): string {
// //   //   return formatDate(dateString, 'mediumDate', 'en-US');
// //   // }
// //   getFormattedTimeAgo(timestamp: string): string {
// //     let date = new Date(timestamp);
// //     if (isNaN(date.getTime())) {
// //       // Handle the invalid date case
// //       return '';
// //     }
// //     return formatDistanceToNow(date, { addSuffix: true });
// //   }
 
// //   formatTimeAgo(timestamp: string | number | Date | number[]): string {
// //     if (!timestamp) return '';
 
// //     let date: Date;
 
// //     if (Array.isArray(timestamp)) {
// //       // If timestamp is an array, construct the Date object
// //       date = new Date(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3], timestamp[4], timestamp[5]);
// //     } else {
// //       // If it's a string, number, or Date object, create Date object directly
// //       date = new Date(timestamp);
// //     }
 
// //     return formatDistanceToNow(date, { addSuffix: true });
// //   }
 
 
 
// //   videoCommentCount: number=0;
// //   articleCommentCount: number=0;
// //   imageCommentCount: number=0;

 
// //   private shortsBatchSize = 3;
// //   isShortsFullScreen = false;
// //   currentShort: Video | null = null;
// //   allVideos: HTMLVideoElement[] = [];
// //   currentVideoIndex: number = 0;
// //   initialVisibleShorts = 3;
// //   currentVideoSrc: string = '';
// //   visibleShorts: Video[] = [];
// //   currentShortIndex: number = 0;
// //   startX: number = 0;
// //   selectedVideoIndex: number | null = null;
// //   showLiveVideo = false;
// //   showMediaOptions = false;
// //   mediaStream: MediaStream | null = null;
// //   showCamera = false;
// //   capturedImage: string | null = null;
// //   isArticleMode: boolean = false;
// //   // currentUserId: number = 1; // Replace with the actual user ID prasna
// //   fullScreenShort: any = null;
// //   isFullScreenView: boolean = false;
// //   // reorderedShorts: any[] = [];
// //   private observer: IntersectionObserver | null = null;
// //   private currentPlayingVideo: HTMLVideoElement | null = null;
 
// //   getIconClass(searchItem: string): string {
// //     const iconsMap: { [key: string]: string } = {
// //       'Education Technology': 'fa-graduation-cap',
// //       'Online Learning Platforms': 'fa-laptop',
// //       'Educational Psychology': 'fa-brain',
// //       'Blended Learning Solutions': 'fa-chalkboard-teacher',
// //       'E-Learning Trends': 'fa-chart-line',
// //       'Education Policy': 'fa-gavel',
// //       'Virtual Classrooms': 'fa-video',
// //       'STEM Education': 'fa-atom',
// //       'Language Learning Apps': 'fa-language',
// //       'Personalized Learning': 'fa-user-graduate',
// //       'Educational Resources': 'fa-book',
// //       'Distance Learning': 'fa-wifi',
// //       'Higher Education': 'fa-university',
// //       'K-12 Education': 'fa-school'
// //     };
 
// //     return iconsMap[searchItem] || 'fa-search';
// //   }
 
 
// //   // user: any; prasna
// //   errorMessage: string = ''
// //   imageUrl: string | null = null; // URL of the uploaded image
// //   originalImage: SafeUrl | null = null; // Store the original image URL
// //   newImage: SafeUrl | null = null;
 
// //   newPost: any = { content: '', image: null, video: null };
// //   // userId: number = 0; prasanna
// //   constructor(private http: HttpClient, private cdRef: ChangeDetectorRef, private fusionService: FusionService, private sanitizer: DomSanitizer, private router: Router,private snackBar: MatSnackBar,private userService : UserService, private authService : AuthService,private route: ActivatedRoute) {
// //   //  prasanna
// //     this.route.params.subscribe(params => {
// //       this.userId = params['id'];
// //     });
// //     this.followRequests$ = this.userService.followRequests$;
// //     this.followerCount$ = this.userService.followerCount$;
// //     this.followingCount$ = this.userService.followingCount$;
// //     this.sentRequestUsers = [];
 
// //   }
 
// //   //prasanna
   
// //   getSafeImageUrl(imageData: string | null | undefined): SafeUrl | null {
// //     if (imageData) {
// //       return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${imageData}`);
// //     }
// //     return null;
// //   }
 
 
// //   ngOnInit(): void { 

// //     this.loadAllPosts();
// // this.getShorts()
   
// // this.user = this.authService.getId(); // Example method to get the logged-in user





// //     this.fetchRecommendations()
// //     console.log('Comments:', this.comments); // Check if comments are populated
 
// //  this.combinedPosts = []
   
// //     // Fetch comments for all posts
// //     this.loadCommentsForAllPosts();
    
// //     // Add this method to your component
   

// //     this.videoPlayer.nativeElement.addEventListener('pause', () => this.handlePause());

// //     this.posts = []
// //     this.loadCommentsForAllPosts();
// //     this.fetchUserDetails();
// //     // ===================================================================================================
// //     //prasanna
// //     this.loadRecommendations();
// //     this.loadFollowRequests();
    
// //     this.fetchUserDetails();
// //     this.userService.fetchUsers();
// //     this.fetchFollowRequests();
// //     this.cuserId =this.authService.getId();
// //     this.currentUserId = this.authService.getId();
// //     if (this.currentUserId) {
// //       // Fetch user details using the current user ID
// //       this.getUserDetails(Number(this.currentUserId));
// //     } else {
// //       console.error('No user is currently logged in');
// //     }
 
// //     this.subscriptions.add(
// //       this.authService.getNameObservable().subscribe(name => {
// //         this.name = name;
// //       })
// //     );
 
// //     this.subscriptions.add(
// //       this.userService.users$.subscribe(users => {
// //         this.users = users;
// //       })
// //     );
 
// //     this.subscriptions.add(
// //       this.authService.getNameObservable().subscribe(id => {
// //         this.currentUserId = id;
// //         // this.fetchFollowerAndFollowingCounts();
// //       })
// //     );
// //     this.userService.followRequests$.subscribe(requests => {
// //       console.log('Follow requests updated:', requests);
     
// //     });
// //     this.userService.users$.subscribe(users => {
// //       // Process users to include profile images
// //       this.users$ = of(users.map(user => ({
// //         ...user,
// //         userImage: user.userImage || null // Ensure userImage is set, even if null
// //       })));
// //     });
 
// //     this.followRequests$ = this.userService.followRequests$.pipe(
// //       map(requests => requests.map(request => ({
// //         ...request,
// //       })))
// //     );
// //    }
   
  


// //    private videoStarted: boolean = false;
// // private viewIncrementTimeout: any;
// // private playStartTime: number | null = null;


// // onTimeUpdate(postId: number, shortId: number) {
// //   if (this.videoPlayer && this.videoPlayer.nativeElement) {
// //     this.watchedTime = this.videoPlayer.nativeElement.currentTime;
    
// //     console.log(`Current video time: ${this.watchedTime.toFixed(2)} seconds`);

// //     if (!this.videoStarted && this.watchedTime > 0) {
// //       this.videoStarted = true;
// //       console.log('Video playback started');
      
// //       // Set a timeout to increment the view count after 3 seconds
// //       this.viewIncrementTimeout = setTimeout(() => {
// //         if (!this.hasIncrementedView) {
// //           console.log(`3 seconds reached at ${this.watchedTime.toFixed(2)}, calling view increment methods`);
// //           this.onVideoViewed(postId);
// //           this.onVideoView2(shortId);
// //           this.hasIncrementedView = true;
// //         }
// //       }, 3000);
// //     }
// //   }
// // }
// // checkPlaybackTime(shortId: number, postId: number) {
// //   if (this.playStartTime === null || this.hasIncrementedView) {
// //     return;
// //   }

// //   const currentTime = Date.now();
// //   const playbackDuration = (currentTime - this.playStartTime) / 100; // Convert to seconds

// //   console.log(`Playback duration for postId: ${postId}, shortId: ${shortId} is ${playbackDuration.toFixed(2)} seconds`);

// //   if (playbackDuration >= 3) {
// //     console.log(`3 seconds reached, calling onVideoViewed for postId: ${postId} and onVideoView2 for shortId: ${shortId}`);
// //     this.onVideoViewed(postId);
// //     this.onVideoView2(shortId);
// //     this.hasIncrementedView = true;
// //   } else {
// //     // Check again in 100ms
// //     this.viewIncrementTimeout = setTimeout(() => this.checkPlaybackTime(shortId, postId), 100);
// //   }
// // }

// // onVideoView2(shortId: number): void {
// //   console.log(`Calling onVideoView2 for shortId: ${shortId} at ${this.watchedTime.toFixed(2)} seconds`);
// //   this.fusionService.incrementViewCount2(shortId).subscribe({
// //     next: () => console.log(`Successfully incremented view count for video ID: ${shortId}`),
// //     error: (err) => console.error(`Failed to increment view count for video ID: ${shortId}`, err)
// //   });
// // }

// // onVideoViewed(postId: number): void {
// //   console.log(`Calling onVideoViewed for postId: ${postId} at ${this.watchedTime.toFixed(2)} seconds`);
// //   this.fusionService.incrementViewCount(postId).subscribe({
// //     next: () => {
// //       console.log('View count incremented successfully');
// //     },
// //     error: (err) => {
// //       console.error('Error incrementing view count', err);
// //     }
// //   });
// // }
// // handlePause() {
// //   if (this.viewIncrementTimeout) {
// //     clearTimeout(this.viewIncrementTimeout);
// //   }
// //   this.playStartTime = null;
// // }
// // // Add this method to handle video end or component destruction
// // onDestroy() {
// //   if (this.viewIncrementTimeout) {
// //     clearTimeout(this.viewIncrementTimeout);
// //   }
// // }
// // //  ==================================================================================================
// // formatViewCount(viewCount: number): string {
// //   if (viewCount >= 1_000_000) {
// //     return `${(viewCount / 1_000_000).toFixed(1)}M`;
// //   } else if (viewCount >= 1_000) {
// //     return `${(viewCount / 1_000).toFixed(1)}K`;
// //   } else {
// //     return `${viewCount}`;
// //   }
// // }
// // private parseDate(dateString: string): Date {
// //   if (!dateString) return new Date(0);
// //   const parsedDate = new Date(dateString);
// //   return isNaN(parsedDate.getTime()) ? new Date(0) : parsedDate;
// // }
// //  loadRecommendations() {
// //     this.userService.users$.subscribe(users => {
// //       this.recommendations = users;
// //     });
// //   }
// //   loadFollowRequests() {
// //     this.userService.followRequests$.subscribe(requests => {
// //       this.followRequests = requests;
// //     });
// //   }
// //   followUser(userId: number) {
// //     this.userService.followUser(userId);
// //     this.sentFollowRequests.push(userId);
// //     // this.updateUsersList();
// //   }
// //   viewMoreSuggestions(): void {
// //     this.router.navigate(['/profile'], { queryParams: { tab: 'Suggestions' } });
// //   }
 
 
// //   acceptFollowRequest(userId: number) {
// //     console.log("is followed becoes true")
// //     this.user.isFollowed = true;
// //     this.user.followRequested = false;
// //     console.log("request accepted")
// //     console.log(userId,"userId")
// //     console.log("usss",this.cuserId)
// //     const followersCount=this.userService.getFollowerCount(this.cuserId);
// //       console.log("Follower count",followersCount);
// //       const followingCount=this.userService.getFollowingCount(this.cuserId);
// //       console.log("following count ",followingCount);
// //     this.userService.duumy(userId,this.cuserId).subscribe((res)=>{
// //       console.log("data",res)
// //       this.userService.removeFollowRequestFromList(userId);
// //       this.userService.acceptFollowRequest(userId);
// //     })
// //     this.sentFollowRequests = this.sentFollowRequests.filter(id => id !== userId);
    
// //   }
 
  
 
// //   ignoreFollowRequest(userId: number) {
// //     this.userService.ignoreFollowRequest(userId);
// //     this.sentFollowRequests = this.sentFollowRequests.filter(id => id !== userId);
// //   // this.updateUsersList();
// //   }
 
// //   cancelFollowRequest(userId: number) {
// //     const currentUserId = this.authService.getId();
// //     if (!currentUserId) {
// //       console.error('No user is currently logged in');
// //       return;
// //     }
 
//     this.userService.cancelFollowRequest(Number(currentUserId), userId).subscribe({
//       next: () => {
//         console.log('Follow request cancelled successfully');
//         // Remove the cancelled request from the sentRequestUsers array
//         this.sentRequestUsers = this.sentRequestUsers.filter(user => user.id !== userId);
//         // Update the sent follow requests
//         // this.fetchSentFollowRequests();
//       },
//       error: (error) => {
//         console.error('Error cancelling follow request:', error);
//       }
//     });
//   }
//   getUserDetails(userId: number): void {
//     this.userService.getUserById(userId).subscribe(
//       user => {
//         this.user = user;
//         console.log('User details:', this.user);
//         // this.fetchFollowerAndFollowingCounts(userId);
//       },
//       error => console.error('Error fetching user details:', error)
//     );
//   }
//   getUserNameById(userId: number): Observable<User> {

//     return this.http.get<User>(`http://54.162.84.143:8080

 
 
 
//  /user/find/${userId}`).pipe(
// //       catchError(error => {
// //         console.error('Error fetching user details', error);
// //         return of({ id: userId, name: 'Unknown User' } as User);
// //       })
// //     );
// //   }
 
// //   loadCommentsForAllPosts(): void {
// //     this.combinedPosts.forEach(post => {
// //       this.loadCommentCount(post.id, post.type);
      
// //     this.loadCommentCount(post.id, 'video');
// //     this.loadCommentCount(post.id, 'article');
// //     this.loadCommentCount(post.id, 'image');
// //     });
// //   }
// //   fetchFollowRequests(): void {
// //     console.log('Fetching follow requests from ProfileComponent');
// //     this.userService.fetchFollowRequests().subscribe(
// //       () => console.log('Follow requests fetched successfully'),
// //       error => console.error('Error in component while fetching follow requests:', error)
// //     );
// //   }
// //   setCurrentUser(user: { id: number; name: string; followers: number; following: number }): void {
// //     this.currentUser = user;
// //     console.log('Current user set to:', this.currentUser);
// //     // this.fetchFriends();
 
// //   }
 
 
// //   fetchRecommendations() {
// //     this.fusionService.fetchRecommendations().subscribe(
// //       (data) => {
// //         this.recommendations = data; // Assuming data is an array of recommendations
// //       },
// //       (error) => {
// //         console.error('Error fetching recommendations:', error);
// //         // Handle error gracefully
// //       }
// //     );
// //   }
 
// //   fetchUserDetails(): void {
// //     const userId = localStorage.getItem('id');
// //     if (userId) {
// //       this.fusionService.getUserById(userId).subscribe({
// //         next: (data) => {
// //           this.user = data;
// //           this.userId = data.id; // Set userId based on fetched user data
 
// //           // Create SafeUrl for user image
// //           if (data.userImage) {
// //             this.userImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data.userImage}`);
// //             this.originalImage = this.userImage; // Set original image
 
// //           }
// //         },
// //         error: (error) => {
// //           console.error('Error fetching user details:', error);
// //         }
// //       });
// //     } else {
// //       console.error('User ID not found in local storage');
// //     }
// //   }
 
 
// // //  ===============================================================================================================
// // // sram
// //   showImagePreview(): void {
// //     if (confirm("Do you want to upload this image?")) {
// //       if (this.selectedFile) {
// //         this.uploadProfileImage(this.selectedFile);
// //       } else {
// //         console.error('No file selected');
// //       }
// //     } else {
// //       this.revertImage();
// //     }
// //   }
 
// //   revertImage(): void {
// //     this.userImage = this.originalImage; // Revert to the original image
// //     this.newImage = null;
// //     this.selectedFile = null; // Clear the selected file
// //   }
 
// //   uploadProfileImage(file: File): void {
// //     if (file && this.userId) {
// //       this.fusionService.uploadUserImage(this.userId, file).subscribe(
// //         (response) => {
// //           console.log(response); // Handle success
// //           this.fetchUserDetails(); // Refresh the profile image after upload
 
// //         },
// //         (error) => {
// //           console.error(error); // Handle error
// //         }
// //       );
// //     } else {
// //       console.error('No file selected or user ID not set');
// //     }
// //   }
// //   togglePostMode() {
// //     this.isPostMode = !this.isPostMode;
// //   }
// //   showPhotoOptions() {
// //     this.showPhotoOptionsModal = true;
// // }
// //   closePhotoOptions() {
// //     this.showPhotoOptionsModal = false;
// // }
 
// // openGallery() {
// //   this.showPhotoOptionsModal = false; // Close the photo options modal
// //  this.fileInput.nativeElement.click();
// //     this.closePhotoOptions();
// // }
 
// // //shorts////
 
// // ngOnDestroy(): void {
// //   if (this.observer) {
// //     this.observer.disconnect();
// //   }
// // }
 
// // setupIntersectionObserver(): void {
// //   const options = {
// //     root: null,
// //     rootMargin: '0px',
// //     threshold: 0.8
// //   };
 
// //   this.observer = new IntersectionObserver((entries) => {
// //     entries.forEach((entry) => {
// //       if (entry.isIntersecting) {
// //         const video = entry.target as HTMLVideoElement;
// //         this.playVideo(video);
// //       } else {
// //         const video = entry.target as HTMLVideoElement;
// //         this.pauseVideo(video);
// //       }
// //     });
// //   }, options);
// // }
 
// // videoLoaded(video: HTMLVideoElement, index: number): void {
// //   if (this.observer) {
// //     this.observer.observe(video);
// //     if (index === 0) {
// //       this.playVideo(video);
// //     }
// //   }
// // }
 
// // playVideo(video: HTMLVideoElement): void {
// //   if (this.currentPlayingVideo && this.currentPlayingVideo !== video) {

// //     this.currentPlayingVideo.pause();
    
// //   }
// //   video.play();
// //   this.currentPlayingVideo = video;

// // }
 
// // pauseVideo(video: HTMLVideoElement): void {
// //   video.pause();
// //   if (this.currentPlayingVideo === video) {
// //     this.currentPlayingVideo = null;
// //   }
// // }
 
// // togglePlayPause(video: HTMLVideoElement): void {
// //   if (video.paused) {
// //     this.playVideo(video);
// //   } else {
// //     this.pauseVideo(video);
// //   }
// // }
 
// // openFullScreenView(index: number): void {
// //   this.reorderShorts(index);
// //   this.isFullScreenView = true;
// //   setTimeout(() => {
// //     this.setupIntersectionObserver();
// //   }, 0);
// // }
 
// // closeFullScreenView(): void {
// //   this.isFullScreenView = false;
// //   if (this.currentPlayingVideo) {
// //     this.currentPlayingVideo.pause();
// //     this.currentPlayingVideo = null;
// //   }
// //   if (this.observer) {
// //     this.observer.disconnect();
// //   }
// // }
 
// // reorderShorts(startIndex: number): void {
// //   this.reorderedShorts = [
// //     ...this.shorts.slice(startIndex),
// //     ...this.shorts.slice(0, startIndex)
// //   ];
// // }
 
// // likeShorts(short: any) {
// //   this.fusionService.reactToPost('video', 'like', short.id).subscribe(
// //     response => {
// //       short.liked = !short.liked;
// //       short.likes += short.liked ? 1 : -1;
// //     },
// //     error => {
// //       console.error('Error liking short:', error);
// //     }
// //   );
// // }
 
// // shareShorts(short: any) {
// //   if ('share' in navigator) {
// //     navigator.share({
// //       title: `Check out this short video`,
// //       url: short.url
// //     }).then(() => {
// //       console.log('Short shared successfully');
// //       this.incrementShortShareCount(short);
// //     }).catch((error) => {
// //       if (error.name !== 'AbortError') {
// //         console.error('Error sharing short:', error);
// //       } else {
// //         console.log('Share dialog was closed without sharing');
// //       }
// //     });
// //   } else {
// //     console.log('Web Share API is not supported in your browser.');
// //     this.fallbackShareShort(short);
// //   }
// // }
 
 
// // private fallbackShareShort(short: any) {
// //   const dummy = document.createElement('input');
// //   document.body.appendChild(dummy);
// //   dummy.value = short.url;
// //   dummy.select();
// //   document.execCommand('copy');
// //   document.body.removeChild(dummy);
 
// //   alert('Short video link copied to clipboard. You can now paste it to share.');
// // }
 
// // private incrementShortShareCount(short: any): void {
// //   this.fusionService.reactToPost('video', 'share', short.id).subscribe(
// //     response => {
// //       console.log('Short share count incremented successfully');
// //       short.shares++;
// //     },
// //     error => {
// //       console.error('Error incrementing short share count:', error);
// //     }
// //   );
// // }
 

// // addCommentToShort(short: any): void {
// //   const trimmedComment = this.newComment.trim();
// //   if (!trimmedComment || !this.user || typeof this.user.id !== 'number') {
// //     console.error('Invalid comment or user');
// //     return;
// //   }
 
// //   this.fusionService.reactToPost(
// //     'video',
// //     'comment',
// //     short.id,
// //     this.user.id,
// //     trimmedComment
// //   ).subscribe(
// //     (response: any) => {
// //       console.log('Comment added successfully', response);
     
// //       if (!this.comments[short.id]) {
// //         this.comments[short.id] = [];
// //       }
 
// //       this.comments[short.id].push(response);
// //       this.newComment = '';
// //     },
// //     (error) => {
// //       console.error('Error adding comment:', error);
// //     }
// //   );
// // }
 
// //  ////groups////
 
// //  openCreateGroupModal(): void {
// //   this.showCreateGroupModal = true;
// // }
 
// // closeCreateGroupModal(): void {
// //   this.showCreateGroupModal = false;
// //   this.newGroupName = '';
// //   this.selectedMembers = [];
// // }
 
// // createGroup(): void {
// //   if (this.newGroupName && this.selectedMembers.length > 0) {
// //     const newGroup: Group = {
// //       id: this.groups.length + 1, // This is a simplistic way to generate an ID
// //       name: this.newGroupName
// //     };
// //     this.groups.push(newGroup);
// //     // Here you would typically call a service to save the new group
// //     console.log('Creating group:', newGroup, 'with members:', this.selectedMembers);
// //     this.closeCreateGroupModal();
// //   }
// // }
 
 
 
 
// // //shorts///
// // addPost() {
// //   if (this.newPost.content || this.newPost.image || this.newPost.video || this.newShortVideo) {
// //     const fileInput: HTMLInputElement = this.fileInput.nativeElement;
// //     const description = this.newPost.content;

// //     if (this.newShortVideo) {
// //       // Handle short video upload
// //       this.uploadShortVideo(this.newShortVideo, description);
// //     } else if (this.newPost.image) {
// //       // Handle both captured and selected images
// //       if (this.newPost.image.startsWith('data:image')) {
// //         // This is a captured image
// //         this.handleCapturedImage(this.newPost.image, description);
// //       } else {
// //         // This is a selected image file
// //         const file = this.dataURLtoFile(this.newPost.image, 'selected_image.jpg');
// //         this.uploadImage(file, description);
// //       }
// //     } else if (fileInput.files && fileInput.files[0]) {
// //       const file = fileInput.files[0];
// //       if (file.type.startsWith('video/')) {
// //         this.uploadVideo(file, description);
// //       } else if (file.type.startsWith('image/')) {
// //         this.uploadImage(file, description);
// //       }
// //     } else if (this.newPost.video) {
// //       // Handle the case where video is set but not from file input
// //       if (this.newPost.video instanceof File) {
// //         // If it's already a File object, use it directly
// //         this.uploadVideo(this.newPost.video, description);
// //       } else if (typeof this.newPost.video === 'string' && this.newPost.video.startsWith('blob:')) {
// //         // If it's a blob URL, fetch it and create a File object
// //         fetch(this.newPost.video)
// //           .then(res => res.blob())
// //           .then(blob => {
// //             const file = new File([blob], "video.mp4", { type: "video/mp4" });
// //             this.uploadVideo(file, description);
// //           });
// //       }
// //     } else if (this.newPost.content) {
// //       // Handle text-only post
// //       this.postTextOnly(description);
// //     }
// //   } else {
// //     this.errorMessage = 'Please enter a description or select media before posting.';
// //     return;
// //   }
  
// //   this.closePostOverlay();
// //   this.clearForm();
// // }

// // resetForm() {
// //   this.newPost = {
// //     content: '',
// //     image: null,
// //     video: null
// //   };
// //   this.newShortVideo = null;
// //   this.shortVideoPreviewUrl = null;
// //   this.isShortVideoMode = false;
// //   this.isPostMode = false;
// //   if (this.fileInput) {
// //     this.fileInput.nativeElement.value = '';
// //   }
// //   if (this.shortVideoInput) {
// //     this.shortVideoInput.nativeElement.value = '';
// //   }
// // }



 
// // // Helper function to convert data URL to File object
// // dataURLtoFile(dataurl: string, filename: string): File {
// //   let arr = dataurl.split(',');
// //   let mime = 'image/jpeg'; // Default MIME type
// //   let bstr: string;
 
// //   if (arr.length > 1) {
// //       let mimeMatch = arr[0].match(/:(.*?);/);
// //       if (mimeMatch) {
// //           mime = mimeMatch[1];
// //       }
// //       bstr = atob(arr[1]);
// //   } else {
// //       bstr = atob(dataurl);
// //   }
 
// //   let n = bstr.length;
// //   let u8arr = new Uint8Array(n);
 
// //   while(n--){
// //       u8arr[n] = bstr.charCodeAt(n);
// //   }
 
// //   return new File([u8arr], filename, {type: mime});
// // }
 
// // uploadImage(file: File, description: string): void {
// //   const formData = new FormData();
// //   formData.append('photo', file);
// //   formData.append('imageDescription', description);
// //   formData.append('userId', this.userId.toString());
 
// //   this.fusionService.createImagePost(this.userId, file, description).subscribe(
// //     response => {
// //       console.log('Image post created successfully', response);
// //       const newImagePost = this.transformToVideoFormat(response, 'image');
// //       this.addNewPostToCombined(newImagePost);
// //       this.clearForm();
// //     },
// //     error => {
// //       console.error('Error creating image post', error);
// //       // Handle error
// //     }
// //   );
// // }
 
 
// // uploadVideo(file: File, description: string): void {
// //   if (!(file instanceof File)) {
// //     console.error('Invalid file object');
// //     return;
// //   }
 
// //   const tempPost: Post = {
// //     id: Date.now(),
// //     description: description,
// //     isVideo: true,
// //     isImage: false,
// //     isArticle: false,
// //     src: '',
// //     profileName: this.user.name,
// //     profileImage: this.userImage || '',
// //     url: '',
// //     type: 'image',
// //     title: '',
// //     likes: 0,
// //     commentCount:0,
// //     views:0,
// //     comments: [],
// //     shares: 0,
// //     content: '',
// //     timestamp: '',
// //     createdAt: '',
// //     text: [],
// //     videoCommentContent: [],
// //     shortVideoLikes: 0,
// //     shortVideoShares: 0,
// //     shortVideoViews: 0,
// //     commentDate: ''
// //   };
 
// //   this.addNewPostToCombined(tempPost);
 
// //   this.fusionService.uploadLongVideo(this.userId, file, description).subscribe({
// //     next: (response) => {
// //       console.log('Video upload completed', response);
// //       this.handleSuccessfulUpload(response, tempPost.id);
// //     },
// //     error: (error: HttpErrorResponse) => {
// //       console.error('Error during video upload', error);
 
// //       if (error.status === 200) {
// //         console.log('Received 200 status with parsing error. Raw response:', error.error.text);
// //         // Extract URL from the raw response text
// //         const match = error.error.text.match(/URL: (.*?)$/);
// //         const videoUrl = match ? match[1].trim() : '';
 
// //         if (videoUrl) {
// //           console.log('Extracted video URL:', videoUrl);
// //           this.handleSuccessfulUpload({ src: videoUrl }, tempPost.id);
// //         } else {
// //           console.warn('Could not extract video URL from response');
// //           this.handleSuccessfulUpload({}, tempPost.id);
// //         }
// //       } else if (error instanceof SyntaxError) {
// //         console.log('Treating SyntaxError as successful upload');
// //         this.handleSuccessfulUpload({}, tempPost.id);
// //       } else {
// //         const index = this.combinedPosts.findIndex(post => post.id === tempPost.id);
// //         if (index !== -1) {
// //           this.combinedPosts[index] = {
// //             ...this.combinedPosts[index],
// //             uploadFailed: true
// //           };
// //           this.cdRef.detectChanges();
// //         }
// //         alert('Error uploading video. The post will appear when you refresh.');
// //       }
// //     }
// //   });
// // }
 
// // private handleSuccessfulUpload(response: any, tempId: number): void {
// //   const index = this.combinedPosts.findIndex(post => post.id === tempId);
// //   if (index !== -1) {
// //     this.combinedPosts[index] = {
// //       ...this.combinedPosts[index],
// //       ...response,
// //       id: response.id || tempId,
// //       src: response.src || this.combinedPosts[index].src,
// //       uploadFailed: false
// //     };
// //     this.cdRef.detectChanges();
// //   }
// //   this.clearForm();
// //   this.newPost = {};
// //   alert('Video uploaded successfully! It may take a moment to process and appear.');
// // }
 

 
// //     handleCapturedImage(dataUrl: string, description: string) {
// //       fetch(dataUrl)
// //           .then(res => res.blob())
// //           .then(blob => {
// //               const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
// //               this.uploadImage(file, description);
// //           })
// //           .catch(error => console.error('Error processing captured image:', error));
// //   }
 
// //   capturePhoto() {
// //       if (this.liveVideo && this.photoCanvas) {
// //           const video = this.liveVideo.nativeElement;
// //           const canvas = this.photoCanvas.nativeElement;
// //           canvas.width = video.videoWidth;
// //           canvas.height = video.videoHeight;
// //           canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
 
// //           // Set the captured image directly to newPost.image
// //           this.newPost.image = canvas.toDataURL('image/jpeg');
// //           this.newPost.video = null;
// //           this.newPost.isImage = true;
// //           this.newPost.isVideo = false;
// //           this.newPost.isArticle = false;
// //           this.isPostMode = true; // Trigger the overlay
// //           this.stopCamera();
// //           this.showMediaOptions = false; // Close the media options
// //           console.log('Photo captured and set to newPost.image');
// //       }
// //   }
 
// //   postCapturedPhoto() {
// //       if (this.newPost.image) {
// //           console.log('Posting captured photo');
// //           this.showMediaOptions = false;
// //           this.isPostMode = true; // Ensure the overlay is shown
// //           // Don't call addPost() here, let the user add a description if they want
// //       } else {
// //           console.error('No captured image to post');
// //       }
// //   }
// //     clearForm() {
// //       this.newPost = { content: '', image: null, video: null, article: null };
// //       this.isArticleMode = false;
// //       this.showMediaOptions = false;
// //       this.capturedImage = null; // Clear captured image
// //       this.newShortVideo = null; // Clear short video file
// //       this.shortVideoPreviewUrl = null; // Clear short video preview URL
// //       this.isShortVideoMode = false; // Reset short video mode
    
// //       if (this.fileInput) {
// //         this.fileInput.nativeElement.value = '';
// //       }
// //       if (this.shortVideoInput) {
// //         this.shortVideoInput.nativeElement.value = '';
// //       }
// //     }
   
// //     postArticle() {
// //       if (this.newPost.article && !this.isPosting) {
// //         this.isPosting = true;
// //         this.fusionService.createArticlePost(this.userId, this.newPost.article).subscribe(
// //           response => {
// //             console.log('Article post created successfully', response);
// //             const newArticle = this.transformToVideoFormat(response, 'article');
// //             this.addNewPostToCombined(newArticle);
// //             this.toggleArticleMode();
// //             this.clearForm();
// //             this.isPosting = false;
// //           },
// //           error => {
// //             console.error('Error creating article post', error);
// //             this.isPosting = false;
// //           }
// //         );
// //       }
// //     }
   
   
// //     postTextOnly(description: string) {
// //       // Implement this method to handle text-only posts
// //       console.log('Posting text-only:', description);
// //       // Call your service method to post text-only content
// //     }
// //     toggleArticleMode() {
// //       this.isArticleMode = !this.isArticleMode;
// //       if (this.isArticleMode) {
// //         this.newPost.article = ''; // Initialize empty article content
// //       } else {
// //         this.newPost.article = null; // Clear article content if mode is toggled off
// //       }
// //     }
   
// //     handleImageErrors(event: any) {
// //       console.error('Image failed to load:', event.target.src);
// //       event.target.src = 'assets/default-avatar.png';  // Make sure this file exists in your assets folder
// //     }
// //     createArticlePost(): void {
// //       if (this.newPost.content) {
// //         this.fusionService.createArticlePost(this.userId, this.newPost.content).subscribe(
// //           response => {
// //             console.log('Article post created successfully', response);
// //             // Handle successful article post creation
// //           },
// //           error => {
// //             console.error('Error creating article post', error);
// //             // Handle error
// //           }
// //         );
// //       }
// //     }
   
   
// //     adjustTextareaHeight(textarea: HTMLTextAreaElement) {
// //       textarea.style.height = 'auto';
// //       textarea.style.height = textarea.scrollHeight + 'px';
// //     }
// //     onFileSelected(event: any) {
// //       this.closePhotoOptions(); // Close the photo options modal if it's open
// //       const file = event.target.files[0];
// //       if (file) {
// //           if (file.type.startsWith('image/')) {
// //               // Image handling
// //               const reader = new FileReader();
// //               reader.onload = (e: any) => {
// //                   this.newPost.image = e.target.result;
// //                   this.newPost.video = null;
// //                   this.newPost.isImage = true;
// //                   this.newPost.isVideo = false;
// //                   this.newPost.isArticle = false;
// //                   this.isPostMode = true; // Trigger the overlay
// //               };
// //               reader.readAsDataURL(file);
// //           } else if (file.type.startsWith('video/')) {
// //               const videoElement = document.createElement('video');
// //               videoElement.preload = 'metadata';
// //               videoElement.src = URL.createObjectURL(file);
 
// //               videoElement.onloadedmetadata = () => {
// //                   const duration = videoElement.duration;
// //                   const width = videoElement.videoWidth;
// //                   const height = videoElement.videoHeight;
 
// //                   // Define criteria for normal videos
// //                   const minDuration = 60; // seconds (1 minute)
// //                   const maxDuration = 3600; // seconds (1 hour, adjust as needed)
// //                   const minWidth = 640; // pixels
// //                   const minHeight = 360; // pixels
 
// //                   if (duration >= minDuration && duration <= maxDuration && width >= minWidth && height >= minHeight) {
// //                       // This is a normal video, proceed with preview
// //                       this.newPost.video = URL.createObjectURL(file);
// //                       this.newPost.image = null;
// //                       this.newPost.isImage = false;
// //                       this.newPost.isVideo = true;
// //                       this.newPost.isArticle = false;
// //                       this.newPost.videoFile = file; // Store the file for later upload
// //                       this.isPostMode = true; // Trigger the overlay
// //                   } else {
// //                       console.error('Video does not meet criteria for normal videos');
// //                       alert('Video does not meet criteria for normal videos. Please ensure your video is at least 1 minute long, not longer than 1 hour, and has a minimum resolution of 640x360.');
// //                   }
 
// //                   URL.revokeObjectURL(videoElement.src);
// //               };
 
// //               videoElement.onerror = () => {
// //                   console.error('Error loading video metadata');
// //                   alert('Error loading video metadata. Please try again with a different video.');
// //                   URL.revokeObjectURL(videoElement.src);
// //               };
// //           }
// //       }
// //   }
   
// //     closePostOverlay() {
// //       this.isPostMode = false;
// //       this.cancelMedia(); // This will clear the image/video and reset the file input
// //       this.newPost.content = '';
// //       this.resetForm();
// //       this.clearForm();


// //     }
// //     cancelMedia() {
// //          this.newPost.image = null;
// //          this.newPost.video = null;
// //          if (this.fileInput) {
// //            this.fileInput.nativeElement.value = '';
// //          }
// //          // Add this line to close the overlay when media is cancelled
// //          this.isPostMode = false;
// //        }
// //        addNewPostToCombined(newPost: Post) {
// //          console.log('Adding new post to combined posts:', newPost);
// //          this.combinedPosts.unshift(newPost);
// //          this.cdRef.detectChanges();
// //        }
    
// //        onShortVideoSelected(event: any) {
// //         const file = event.target.files[0];
// //         if (file && file.type.startsWith('video/')) {
// //           this.newShortVideo = file;
// //           this.shortVideoPreviewUrl = URL.createObjectURL(file);
// //           this.isPostMode = true;
// //           this.isShortVideoMode = true;
// //         } else {
// //           this.errorMessage = 'Please select a valid video file.';
// //         }
// //       }
// //      triggerShortVideoUpload() {
// //        this.shortVideoInput.nativeElement.click();
// //      }
    
    
// //      uploadShortVideo(file: File, description: string): void {
// //       const videoElement = document.createElement('video');
// //       videoElement.src = URL.createObjectURL(file);
    
// //       videoElement.onloadedmetadata = () => {
// //         const duration = videoElement.duration;
// //         const width = videoElement.videoWidth;
// //         const height = videoElement.videoHeight;
    
// //         // Example criteria for shorts:
// //         const maxDuration = 120; // seconds
// //         const maxWidth = 1080; // pixels
// //         const maxHeight = 1920; // pixels
    
// //         if (duration <= maxDuration && width <= maxWidth && height <= maxHeight) {
// //           console.log('Uploading short video:', file.name);
// //           this.errorMessage = ''; // Clear any previous error message
// //           this.fusionService.uploadShortVideo(this.userId, file, description).subscribe(
// //             response => {
// //               console.log('Short video uploaded successfully', response);
// //               const newShortVideo = this.transformToVideoFormat(response, 'video');
// //               this.shorts.unshift(newShortVideo);
// //               alert('Short Video uploaded successfully.');
// //             },
// //             error => {
// //               if (error.status !== 200) {
// //                 console.error('Error uploading short video', error);
// //                 this.errorMessage = 'Error uploading short video. Please try again.';
// //               } else {
// //                 // If status is 200, treat it as a success
// //                 console.log('Short video uploaded successfully');
// //                 alert('Short Video uploaded successfully.');
    
// //                 const newShortVideo = this.transformToVideoFormat(error.error, 'video');
// //                 this.shorts.unshift(newShortVideo);
// //               }
// //             }
// //           );
// //         } else {
// //           this.errorMessage = 'Video does not meet the criteria for shorts. Please ensure your video is no longer than 120 seconds and has a max resolution of 1080x1920. Or Upload in Video Section';
// //         }
// //       };
    
// //       videoElement.onerror = () => {
// //         this.errorMessage = 'Error loading video metadata. Please try again with a different video.';
// //       };
// //     }
// //      clearErrorMessage(): void {
// //        this.errorMessage = '';
// //      }
    
    
// //      getShorts(): void {
// //       this.fusionService.getShortVideos().subscribe(
// //         (data) => {
// //           this.shorts = data.map(video => ({
// //             id: video.id,
// //             src: video.s3Url,
// //             profileName: video.user.name,
// //             profileImage: video.user.userImage,
// //             likes: video.longVideoLikes || 0,
// //             shares: video.longVideoShares || 0,
// //             timestamp: video.createdAt,
// //             tag: video.tag || null,
// //             url: video.s3Url,
// //             type: 'video',
// //             views: video.longVideoViews || 0,
// //             title: video.longVideoTitle || '',
// //             comments: video.videoComments || [],
// //             longVideoDescription: video.longVideoDescription // Add this line
// //           }));
          
// //           this.reorderedShorts = [...this.shorts]; // Create a copy of shorts
// //           console.log('Transformed shorts:', this.shorts);
// //           console.log('Reordered shorts:', this.reorderedShorts);
// //         },
// //         (error) => console.error('Error fetching videos:', error)
// //       );
// //     }
    
// //     transformToVideoFormats(video: any, type: string) {
// //       return {
// //         id: video.id,
// //         src: video.s3Url,
// //         profileName: video.user.name,
// //         profileImage: video.user.userImage,
// //         likes: type === 'video' ? video.longVideoLikes || 0 : 0,
// //         shares: type === 'video' ? video.longVideoShares || 0 : 0,
// //         views: type === 'video' ? video.longVideoViews || 0 : 0,

// //         timestamp: video.createdAt,
// //         tag: video.tag, // Add this line
// //         // ... other properties
// //       };
// //     }
    
    
// //      transformToVideoFormat(item: any, type: 'video' | 'image' | 'article'): Post {
// //        const createImageSrc = (imageData: string): string => {
    
//          if (imageData.startsWith('data:image')) {
//            return imageData;
//          } else if (imageData.startsWith('http') || imageData.startsWith('http')) {
//            return imageData;
//          } else {
//            return `data:image/jpeg;base64,${imageData}`;
//          }
//        };
    
// //        let mappedComments: any[] = [];
    
// //        try {
// //          mappedComments = Array.isArray(item.videoCommentContent) ?
// //            item.videoCommentContent.map((comment: any) => ({
// //              id: comment.id,
// //              content: comment.videoCommentContent || '',
// //              author: comment.user?.name || 'Unknown Author',
// //            createdAt: new Date(comment.createdAt).toISOString(),  // Ensure correct date format
// //            })) :
// //            [];
// //        } catch (error) {
// //          console.error('Error mapping comments:', error);
// //        }
// //        const profileImage: SafeUrl = this.sanitizeImage(item.user?.userImage || '../../assets/download.png');
    
// //        return {
// //          id: item.id,
// //          type,
// //          url: '',
// //          description: item.description || '',
// //          title: item.title || '',
// //          isVideo: type === 'video',
// //          isImage: type === 'image',
// //          isArticle: type === 'article',
// //          src: type === 'image' ? createImageSrc(item.photo) : (type === 'video' ? item.s3Url : ''),
// //          likes: type === 'article' ? item.articleLikeCount || 0 : 
// //        (type === 'image' ? item.imageLikeCount || 0 : 
// //        (type === 'video' ? item.shortVideoLikes || 0 : 
// //        (type === 'longVideo' ? item.longVideoLikes || 0 : 0))),

// // shares: type === 'article' ? item.articleShareCount || 0 : 
// //         (type === 'image' ? item.imageShareCount || 0 : 
// //         (type === 'video' ? item.shortVideoShares || 0 : 
// //         (type === 'longVideo' ? item.longVideoShares || 0 : 0))),
// //          timestamp: item.postDate,
// //          createdAt:item.createdAt ,
// //          commentDate:item.commentDate,
// //          comments: mappedComments,
// //          // share: item.shareCount || 0,
// //          showComments: false,
// //          liked: false,
// //          showShareMenu: false,
// //          views:type === 'video' ? item.shortVideoViews || 0 : 0,
// //          commentCount:item.commentCount || 0  ,
// //          saved: false,
// //          profileImage,
// //          profileName: item.user?.name || 'Unknown User',
// //          content: type === 'article' ? item.article || '' : (type === 'image' ? item.imageDescription || '' : item.shortVideoDescription || ''),
// //          showFullContent: false,
// //          showShareModal: false,
// //          videoCommentContent: item.videoCommentContent || [],
// //          text:item.text ||  [],
// //          shortVideoLikes: item.shortVideoLikes || 0,
// //          shortVideoShares: item.shortVideoShares || 0,
// //          shortVideoViews: item.shortVideoViews || 0
// //        };
// //      }
    
    
    
//      sanitizeImage(imageData: string): SafeUrl {
//      if (imageData.startsWith('data:image')) {
//        return this.sanitizer.bypassSecurityTrustUrl(imageData);
//      } else if (imageData.startsWith('http') || imageData.startsWith('http')) {
//        return this.sanitizer.bypassSecurityTrustUrl(imageData);
//      } else {
//        // Assuming imageData is base64 encoded JPEG
//        return this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${imageData}`);
//      }
//    }
    
    
    
// //    onFileSelected1(event: any, context: 'profile' | 'post') {
// //      const file = event.target.files[0];
// //      if (file) {
// //        if (file.type.startsWith('image/')) {
// //          const reader = new FileReader();
// //          reader.onload = (e: any) => {
// //            if (context === 'profile') {
// //              // Handle profile image selection
// //              this.newImage = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
// //              this.selectedFile = file; // Store the selected file
// //              this.showImagePreview();
// //            } else if (context === 'post') {
// //              // Handle post image selection
// //              this.newPost.image = e.target.result;
// //              this.newPost.video = null;
// //              this.newPost.isImage = true;
// //              this.newPost.isVideo = false;
// //              this.newPost.isArticle = false;
// //            }
// //          };
// //          reader.readAsDataURL(file);
// //        } else if (file.type.startsWith('video/') && context === 'post') {
// //          // Only handle video if the context is 'post'
// //          const videoElement = document.createElement('video');
// //          videoElement.preload = 'metadata';
// //          videoElement.src = URL.createObjectURL(file);
    
// //          videoElement.onloadedmetadata = () => {
// //            const duration = videoElement.duration;
// //            const width = videoElement.videoWidth;
// //            const height = videoElement.videoHeight;
    
// //            const minDuration = 60; // seconds (1 minute)
// //            const maxDuration = 3600; // seconds (1 hour, adjust as needed)
// //            const minWidth = 640; // pixels
// //            const minHeight = 360; // pixels
    
// //            if (duration >= minDuration && duration <= maxDuration && width >= minWidth && height >= minHeight) {
// //              this.newPost.video = URL.createObjectURL(file);
// //              this.newPost.image = null;
// //              this.newPost.isImage = false;
// //              this.newPost.isVideo = true;
// //              this.newPost.isArticle = false;
// //              this.newPost.videoFile = file;
// //            } else {
// //              console.error('Video does not meet criteria for normal videos');
// //              alert('Video does not meet criteria for normal videos. Please ensure your video is at least 1 minute long, not longer than 1 hour, and has a minimum resolution of 640x360.');
// //            }
    
// //            URL.revokeObjectURL(videoElement.src);
// //          };
    
// //          videoElement.onerror = () => {
// //            console.error('Error loading video metadata');
// //            alert('Error loading video metadata. Please try again with a different video.');
// //            URL.revokeObjectURL(videoElement.src);
// //          };
// //        }
// //      }
// //    }
    
// //    toggleSaveShort(short: any) {
// //     short.saved = !short.saved;
// //   }
// //    savePost(post: any) {
// //     const userIdString = localStorage.getItem('id');
// //     if (!userIdString) {
// //       console.error('User ID not available');
// //       return;
// //     }
// //     const userId = parseInt(userIdString, 10);
  
// //     let saveEndpoint: string;
// //     let postIdParam: string;
  
// //     switch (post.type) {
// //       case 'image':
// //         saveEndpoint = 'saveImagePost';
// //         postIdParam = 'imagePostId';
// //         break;
// //       case 'article':
// //         saveEndpoint = 'saveArticlePost';
// //         postIdParam = 'articlePostId';
// //         break;
// //       case 'video':
// //       case 'shortVideo':
// //         saveEndpoint = 'saveShortVideo';
// //         postIdParam = 'shortVideoId';
// //         break;
// //       default:
// //         console.error('Unknown post type:', post.type);
// //         this.showAlert('Error saving post. Unknown post type.');
// //         return;
// //     }
// //     if (post.saved) {
// //       // If the post is marked as saved, attempt to unsave it
// //       this.attemptUnsave(post, userId);
// //     } else {
// //       // If the post is not saved, attempt to save it
// //       this.fusionService.savePost(saveEndpoint, userId, post.id, postIdParam).subscribe(
// //         (response: any) => {
// //           post.saved = true;
// //           post.savedItemId = response.id;
// //           console.log('Post saved successfully');
// //           this.showAlert('Post saved successfully');
// //         },
// //         (error: HttpErrorResponse) => {
// //           if (error.status === 200 && error.error === 'Item already saved') {
// //             post.saved = true;
// //             // Since the item is already saved, we need to fetch the savedItemId
// //             this.fetchSavedItemId(post, userId);
// //             this.showAlert('Post already saved');
// //           } else {
// //             console.error('Error saving post:', error);
// //             this.showAlert('Error saving post. Please try again.');
// //           }
// //         }
// //       );
// //     }
// //   }
  
// //   private attemptUnsave(post: any, userId: number) {
// //     if (!post.savedItemId) {
// //       // If savedItemId is not available, try to fetch it first
// //       this.fetchSavedItemId(post, userId).then(() => {
// //         this.performUnsave(post, userId);
// //       }).catch(error => {
// //         console.error('Error fetching savedItemId:', error);
// //         this.showAlert('Error unsaving post. Please try again.');
// //       });
// //     } else {
// //       this.performUnsave(post, userId);
// //     }
// //   }
  
// //   private fetchSavedItemId(post: any, userId: number): Promise<void> {
// //     return new Promise((resolve, reject) => {
// //       // Convert 'video' type to 'shortVideo' for backend compatibility
// //       const postType = post.type === 'video' ? 'shortVideo' : post.type;
      
// //       this.fusionService.getSavedItemId(postType, userId, post.id).subscribe(
// //         (savedItemId: number) => {
// //           post.savedItemId = savedItemId;
// //           resolve();
// //         },
// //         error => {
// //           console.error('Error fetching savedItemId:', error);
// //           reject(error);
// //         }
// //       );
// //     });
// //   }
  
// //   private performUnsave(post: any, userId: number) {
// //     let deleteEndpoint: string;
// //     switch (post.type) {
// //       case 'image':
// //         deleteEndpoint = 'deleteImagePost';
// //         break;
// //       case 'article':
// //         deleteEndpoint = 'deleteArticlePost';
// //         break;
// //       case 'video':
// //       case 'shortVideo':
// //         deleteEndpoint = 'deleteShortVideo';
// //         break;
// //       default:
// //         console.error('Unknown post type:', post.type);
// //         this.showAlert('Error unsaving post. Unknown post type.');
// //         return;
// //     }
// //     this.fusionService.unsavePost(deleteEndpoint, userId, post.id).subscribe(
// //       () => {
// //         post.saved = false;
// //         post.savedItemId = undefined;
// //         console.log('Post unsaved successfully');
// //         this.showAlert('Post unsaved successfully');
// //       },
// //       (error) => {
// //         console.error('Error unsaving post:', error);
// //         this.showAlert('Error unsaving post. Please try again.');
// //       }
// //     );
// //   }
  
// //   private showAlert(message: string) {
// //     this.snackBar.open(message, 'Close', {
// //       duration: 3000,
// //       horizontalPosition: 'center',
// //       verticalPosition: 'bottom',
// //     });
// //   }
// //   updateSavedStatus(posts: any[]) {
// //     const userIdString = localStorage.getItem('id');
// //     if (!userIdString) {
// //       console.error('User ID not available');
// //       return;
// //     }
// //     const userId = parseInt(userIdString, 10);
  
// //     this.fusionService.getAllSavedItems(userId).subscribe(
// //       (savedItems: any) => {
// //         posts.forEach(post => {
// //           switch (post.type) {
// //             case 'image':
// //               post.saved = savedItems.imagePosts.some((savedPost: any) => savedPost.id === post.id);
// //               break;
// //             case 'article':
// //               post.saved = savedItems.articlePosts.some((savedPost: any) => savedPost.id === post.id);
// //               break;
// //             case 'video':
// //             case 'shortVideo':
// //               post.saved = savedItems.shortVideos.some((savedPost: any) => savedPost.id === post.id);
// //               break;
// //             // Remove the 'longVideo' case as it's no longer needed
// //           }
// //         });
// //       },
// //       error => {
// //         console.error('Error fetching saved items:', error);
// //       }
// //     );
// //   }
  
    
// //     ///save////
    
    
    
    
    
    
    
// //      toggleComments(postId: number, postType: 'video' | 'article' | 'image'): void {
// //        const post = this.combinedPosts.find(post => post.id === postId && post.type === postType);
// //        if (post) {
// //          post.showComments = !post.showComments;
// //          if (post.showComments && !this.comments[postId]) {
// //            this.fetchComments(postType, postId);
// //          }
// //        } else {
// //          console.error('Post not found');
// //        }
// //      }
// //      addComment(postId: number, postType: 'video' | 'article' | 'image'): void {
// //       const post = this.combinedPosts.find(post => post.id === postId && post.type === postType);
// //       if (!post) {
// //         console.error('Post not found');
// //         return;
// //       }
    
// //       const trimmedComment = this.newComment.trim();
// //       if (!trimmedComment) {
// //         console.error('Comment is empty');
// //         return;
// //       }
    
// //       console.log('Current user:', this.user);
// //       if (!this.user || this.user.id === undefined) {
// //         console.error('User not logged in or user ID is not available');
// //         return;
// //       }
    
// //       // Check if the user ID is a number
// //       let userId: number;
// //       if (typeof this.user.id === 'number') {
// //         userId = this.user.id;
// //       } else if (typeof this.user.id === 'string') {
// //         const parsedUserId = parseInt(this.user.id, 10);
// //         if (isNaN(parsedUserId)) {
// //           console.error('User ID is not a valid number');
// //           return;
// //         }
// //         userId = parsedUserId;
// //       } else {
// //         console.error('User ID is not a valid number');
// //         return;
// //       }
    
// //       this.fusionService.reactToPost(
// //         postType,
// //         'comment',
// //         postId,
// //         userId,
// //         postType === 'video' ? trimmedComment : undefined,
// //         postType === 'image' ? trimmedComment : undefined,
// //         postType === 'article' ? trimmedComment : undefined
// //       ).subscribe(
// //         (response: any) => {
// //           console.log('Comment added successfully', response);
          
// //           // Ensure that the post has a comments array
// //           if (!this.comments[postId]) {
// //             this.comments[postId] = [];
// //           }
    
// //           // Add the new comment to the post's comments
// //           this.comments[postId].push(response);
    
// //           // Clear the newComment field after posting
// //           this.newComment = '';
// //         },
// //         (error) => {
// //           console.error('Error adding comment:', error);
// //           // Handle error if needed
// //         }
// //       );
// //     }
// //      toggleReplies(commentId: number) {
// //        this.repliesVisible[commentId] = !this.repliesVisible[commentId];
// //      }
    
    
// //      toggleReply(commentId: number): void {
// //        this.replyingTo[commentId] = !this.replyingTo[commentId];
// //        if (!this.replyingTo[commentId]) {
// //          this.newReply[commentId] = '';
// //        }
// //      }
    
// //      addReply(postId: number, postType: 'video' | 'article' | 'image', commentId: number): void {
// //        const trimmedReply = this.newReply[commentId].trim();
// //        if (!trimmedReply || !this.user || typeof this.user.id !== 'number') {
// //          console.error('Invalid reply or user');
// //          return;
// //        }
    
// //        this.fusionService.addReplyToComment(
// //          postType,
// //          postId,
// //          this.user.id,
// //          trimmedReply,
// //          commentId
// //        ).subscribe(
// //          (response: any) => {
// //            console.log('Reply added successfully', response);
          
// //            // Initialize replies array if it doesn't exist
// //            if (!this.replies[commentId]) {
// //              this.replies[commentId] = [];
// //            }
    
// //            // Add the new reply to the replies array
// //            this.replies[commentId].push({
// //              ...response,
// //              user: this.user,
// //              createdAt: new Date().toISOString(),
// //              text: trimmedReply
            
// //            });
    
// //            // Clear the reply field and hide the reply form
// //            this.newReply[commentId] = '';
// //            this.replyingTo[commentId] = false;
// //          },
// //          (error) => {
// //            console.error('Error adding reply:', error);
// //            // Handle error if needed
// //          }
// //        );
// //      }


// //      loadCommentCount(postId: number, postType: 'video' | 'article' | 'image'): void {
// //       this.fusionService.getCommentCount(postId, postType).subscribe({
// //         next: (count: any) => {
// //           switch (postType) {
// //             case 'video':
// //               this.videoCommentCount = count;
// //               break;
// //             case 'article':
// //               this.articleCommentCount = count;
// //               break;
// //             case 'image':
// //               this.imageCommentCount = count;
// //               break;
// //           }
// //         },
// //         error: (err: any) => console.error(`Failed to load comment count for ${postType}`, err)
// //       });
// //     }
  



// //      likePost(post: any) {
// //        this.fusionService.reactToPost(post.type,'like',post.id).subscribe(
// //          response => {
// //            // Handle successful like
// //            post.liked = !post.liked;
// //            post.likes += post.liked ? 1 : -1;
// //          },
// //          error => {
// //            // Handle error
// //            console.error('Error liking post:', error);
// //          }
// //        );
// //      }
    
    
    
// //      sharePost(post: Post) {
// //        if ('share' in navigator) {
// //          navigator.share({
// //            title: `Check out this ${post.type}`,
// //            url: post.url
// //          }).then(() => {
// //            console.log('Content shared successfully');
// //            this.incrementShareCount(post);
// //          }).catch((error) => {
// //            if (error.name !== 'AbortError') {
// //              console.error('Error sharing content:', error);
// //            } else {
// //              console.log('Share dialog was closed without sharing');
// //            }
// //          });
// //        } else {
// //          console.log('Web Share API is not supported in your browser.');
// //          // Implement fallback sharing method here
// //          this.fallbackShare(post);
// //        }
// //      }
    
// //      private fallbackShare(post: Post) {
// //        // Implement a fallback sharing method
// //        // For example, you could copy the link to clipboard
// //        const dummy = document.createElement('input');
// //        document.body.appendChild(dummy);
// //        dummy.value = post.url;
// //        dummy.select();
// //        document.execCommand('copy');
// //        document.body.removeChild(dummy);
    
// //        alert('Link copied to clipboard. You can now paste it to share.');
      
// //        // Only increment the share count if you consider copying to clipboard as a share action
// //        // this.incrementShareCount(post);
// //      }
    
// //      incrementShareCount(post: Post): void {
// //        this.fusionService.reactToPost(post.type, 'share', post.id).subscribe(
// //          response => {
// //            console.log('Share count incremented successfully');
// //            // Increment the share count locally
// //            post.shares++;
// //            // If the API returns the updated share count, use that instead
// //            // post.shares = response.shareCount;
// //          },
// //          error => {
// //            console.error('Error incrementing share count:', error);
// //          }
// //        );
// //      }


// //      reactToPost(type: 'video' | 'article' | 'image', action: 'like' | 'dislike' | 'share' | 'view' | 'comment', postId: number, userId?: number, content?: string): void {
// //        console.log('Before action:', ); // Log the post before the action
    
// //        // Optimistically update UI
    
// //        // Call the service
// //        this.fusionService.reactToPost(type, action, postId, userId, content).subscribe(
// //          response => {
// //            console.log('Action successful:', response);
// //            // Fetch the updated post from the server
// //            this.post.liked = !this.post.liked;
// //        this.post.likes += this.post.liked ? 1 : -1;
    
// //          },
// //          error => {
// //            console.error('Error performing action:', error);
// //            // Revert the optimistic update in case of error
// //          }
// //        );
// //      }
    
// //      // Helper method to get a post by id
    
    
    
    
// //      fetchComments(postType: 'video' | 'article' | 'image', postId: number): void {
// //        this.fusionService.getCommentss(postType, postId).subscribe(
// //          (comments: any[]) => {
// //            this.comments[postId] = comments.map(comment => ({
// //              ...comment,
// //              replies: []
// //            }));
    
// //            // Fetch replies for each comment
// //            this.comments[postId].forEach(comment => {
// //              this.fetchReplies(postType, comment.id,postId);
// //            });
// //          },
// //          error => {
// //            console.error('Error fetching comments:', error);
// //          }
// //        );
// //      }
    
    
    
    
// //      fetchReplies(postType: 'video' | 'article' | 'image', commentId: number,postId:number) {
// //        this.fusionService.getReplies(postType, commentId,postId).subscribe(
// //          (serviceReplies: any[]) => {
    
// //            this.replies[commentId] = serviceReplies.map(reply => this.mapServiceCommentToComment(reply));
// //          },
// //          (error) => {
// //            console.error('Error fetching replies:', error);
// //          }
// //        );
// //      }
// //      private mapServiceCommentToComment(serviceComment: any): Comment {
// //        return {
// //          id: serviceComment.id || 0,
// //          commentDate:serviceComment.commentDate,
// //          text: serviceComment.text || '',
// //          postId:serviceComment.postId,
// //          timestamp: serviceComment.timestamp || '',
// //          profileImage: serviceComment.user?.profileImage || 'default-profile-image-url',
// //          userImage: serviceComment.user?.userImage || 'default-user-image-url',
// //          user: {
// //           id:serviceComment.user?.id,
// //            profileImage:serviceComment.user?.profileImage,  // Adjusted to accept SafeUrl
// //            userImage:serviceComment.user?.userImage,  // Adjusted to accept SafeUrl
    
// //            name: serviceComment.user?.name || 'Unknown User'
// //          },
// //          content: serviceComment.content || '',
// //          videoCommentContent: serviceComment.videoCommentContent || '',
// //          createdAt: serviceComment.createdAt || '',
// //          // Add any other properties that are part of your Comment interface
// //        };
// //      }
// //      getAvatarBackgroundImage(user: any): string {
// //        console.log('User object:', user);
// //        if (user && user.userImage) {
// //          console.log('User image:', user.userImage);
// //          // The userImage seems to be a base64 string without the data URL prefix
// //          return `url(data:image/jpeg;base64,${user.userImage})`;
// //        }
// //        console.log('No user image found');
// //        return 'none';
// //      }
    
// //      likeComment(postId: number, commentId: number): void {
// //        const post = this.combinedPosts.find(p => p.id === postId);
// //        if (!post) {
// //          console.error('Post not found');
// //          return;
// //        }
    
// //        const comment = this.comments[postId]?.find(c => c.id === commentId);
    
// //        if (comment) {
// //          this.fusionService.likeComment(post.type, postId, commentId,this.userId).subscribe(
// //            (response: any) => {
// //              comment.liked = !comment.liked;
// //              comment.likes = comment.liked ? (comment.likes || 0) + 1 : Math.max((comment.likes || 0) - 1, 0);
// //            },
// //            (error) => {
// //              console.error('Error liking comment:', error);
// //            }
// //          );
// //        }
// //      }
    
// //      likeReply(postId: number, commentId: number, replyId: number): void {
// //        const post = this.combinedPosts.find(p => p.id === postId);
// //        if (!post) {
// //          console.error('Post not found');
// //          return;
// //        }
    
// //        const reply = this.replies[commentId]?.find(r => r.id === replyId);
// //        if (reply) {
    
// //          this.fusionService.likeReply(post.type, postId, commentId, replyId).
        
// //          subscribe(
          
// //            (response: any) => {
// //              reply.liked = !reply.liked;
// //              reply.likes = reply.liked ? (reply.likes || 0) + 1 : Math.max((reply.likes || 0) - 1, 0);
// //            },
// //            (error) => {
// //              console.error('Error liking reply:', error);
// //            }
// //          );
// //        }
// //      }
    
    
    
// //      onDeleteComment(type: 'video' | 'article' | 'image', postId: number, commentId: number): void {
// //        this.fusionService.deleteComment(type, postId, commentId).subscribe(
// //          () => {
// //            console.log('Comment deleted successfully');
// //            // Update your UI accordingly
// //            // this.comments = this.comments.filter(comment => comment.id !== commentId);
// //          },
// //          error => {
// //            console.error('Error deleting comment:', error);
// //          }
// //        );
// //      }
    
    
    
    
    
    
     

    
    
// //      ngAfterViewInit(): void { }
    
// //      getVideos(): Observable<any[]> {
// //       return this.fusionService.getAllLongVideos().pipe(
// //         map(data => data.map(video => this.transformToVideoFormat(video, 'video')))
        
        
// //       );
      
// //     }
    
// //     getImages(): Observable<any[]> {
// //       return this.fusionService.getAllImagePosts().pipe(
// //         map(data => data.map(image => this.transformToVideoFormat(image, 'image')))
// //       );
      
// //     }
    
// //     getArticles(): Observable<any[]> {
// //       return this.fusionService.getAllArticlePosts().pipe(
// //         map(data => data.map(article => this.transformToVideoFormat(article, 'article')))
// //       );
// //     }
// //      updateCombinedPosts(): void {
// //        this.combinedPosts = [...this.videos, ...this.images, ...this.articles];
    
// //      }
    
// //      handleImageError(event: any) {
// //       event.target.src = '../../assets/download.png'; // Ensure this path is correct
// //       console.error('Image failed to load:', event.target.src);
// //      }
    
    
// //      loadAllPosts(): void {
// //       forkJoin({
// //         videos: this.getVideos(),
// //         images: this.getImages(),
// //         articles: this.getArticles()
// //       }).subscribe({
// //         next: (result) => {
// //           this.combinedPosts = [
// //             ...result.videos.map(post => ({ ...post, type: 'video', isVideo: true })),
// //             ...result.images.map(post => ({ ...post, type: 'image', isImage: true })),
// //             ...result.articles.map(post => ({ ...post, type: 'article', isArticle: true }))
// //           ];
    
// //           // Sort the combined posts by timestamp
// //           this.combinedPosts.sort((a, b) => {
// //             const dateA = new Date(a.timestamp || a.createdAt);
// //             const dateB = new Date(b.timestamp || b.createdAt);
// //             return dateB.getTime() - dateA.getTime();
// //           });
    
// //           console.log('Combined and sorted posts:', this.combinedPosts);
    
// //           this.updateSavedStatus(this.combinedPosts);
// //         },
// //         error: (error) => console.error('Error fetching posts:', error)
// //       });
// //     }
    
    
    
   
    
    
    
    
    
    
    
// //      fetchCommentCount(postId: number): void {
// //        this.fusionService.getCommentCount1(postId).subscribe(
// //          (count: number) => {
// //            this.commentCount = count;
// //          },
// //          (error: any) => {
// //            console.error('Error fetching comment count:', error);
// //          }
// //        );
// //      }
// //      shareShort1(short: { src: string }) {
// //        if (navigator.share) {
// //          navigator.share({
// //            title: 'Check out this video',
// //            url: short.src
// //          }).then(() => {
// //            console.log('Thanks for sharing!');
// //          }).catch(console.error);
// //        } else {
    
// //          console.log('Share API is not supported in your browser.');
// //        }
// //      }
    
    
    
// //      toggleSave(postId: number): void {
// //        const post = this.videos.find(video => video.id === postId);
// //        if (post) {
// //          post.saved = !post.saved;
// //        } else {
// //          console.error('Post not found');
// //        }
// //      }
    
// //      toggleShareMenu(postId: number): void {
// //        const post = this.videos.find(video => video.id === postId);
// //        if (post) {
// //          post.showShareMenu = !post.showShareMenu;
// //        } else {
// //          console.error('Post not found');
// //        }
// //      }
    
// //      toggleShareModal(postId: number): void {
// //        const post = this.videos.find(video => video.id === postId);
// //        if (post) {
// //          post.showShareModal = !post.showShareModal;
// //        } else {
// //          console.error('Post not found');
// //        }
// //      }
    
    
    
    
// //      openShortsFullScreen(): void {
// //        this.isShortsFullScreen = true;
// //        this.pauseAndMuteAllVideos();
// //        setTimeout(() => {
// //          this.playCurrentShort(0);
// //          const videoElements = Array.from(document.querySelectorAll('.shorts-full-screen video')) as HTMLVideoElement[];
// //          videoElements.forEach(video => {
// //            video.addEventListener('play', () => this.pauseOtherVideos(video));
// //          });
// //        });
// //      }
    
// //      exitShortsFullScreen(): void {
// //        this.isShortsFullScreen = false;
// //        setTimeout(() => {
// //          const videoElements = Array.from(document.querySelectorAll('.shorts-full-screen video')) as HTMLVideoElement[];
// //          videoElements.forEach(video => {
// //            video.pause();
// //            video.muted = false;
// //          });
// //        });
// //        this.unmuteAllVideos();
// //      }
    
// //      private playCurrentShort(index: number): void {
// //        const videoElements = Array.from(document.querySelectorAll('.shorts-full-screen video')) as HTMLVideoElement[];
// //        if (videoElements[index]) {
// //          videoElements[index].play();
// //        }
// //      }
// //      private pauseOtherVideos(currentVideo: HTMLVideoElement): void {
// //        const allVideos = Array.from(document.querySelectorAll('video'));
// //        allVideos.forEach(video => {
// //          if (video !== currentVideo) {
// //            video.pause();
// //          }
// //        });
// //      }
    
// //      private pauseAndMuteAllVideos(): void {
// //        const allVideos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
// //        allVideos.forEach(video => {
// //          video.pause();
// //          video.muted = true;
// //        });
// //      }
    
// //      onVideoPlay(event: Event,shortId:number,postId:number): void {
// //        const currentVideo = event.target as HTMLVideoElement;
// //        this.pauseOtherVideos(currentVideo);
// //        console.log('Video started playing');
// //        this.playStartTime = Date.now();
// //        this.checkPlaybackTime(shortId,postId);
// //      }
     
    
// //      private unmuteAllVideos(): void {
// //        const allVideos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
// //        allVideos.forEach(video => {
// //          video.pause();
// //          video.muted = false;
// //        });
// //      }
    
// //      private addPlayEventListeners(): void {
// //        const allVideos = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
// //        allVideos.forEach(video => {
// //          video.addEventListener('play', () => this.pauseOtherVideos(video));
// //        });
// //      }
    
// //      startLiveVideo() {
// //        this.showLiveVideo = true;
// //        navigator.mediaDevices.getUserMedia({ video: true })
// //          .then(stream => {
// //            this.mediaStream = stream;
// //            this.liveVideo.nativeElement.srcObject = stream;
// //          })
// //          .catch(error => console.error('Error accessing camera:', error));
// //      }
    
// //      stopLiveVideo() {
// //        if (this.mediaStream) {
// //          this.mediaStream.getTracks().forEach(track => track.stop());
// //        }
// //        this.showLiveVideo = false;
// //      }
    
// //      openMediaOptions() {
// //        this.showMediaOptions = true;
// //      }
    
// //      closeMediaOptions() {
// //        this.showMediaOptions = false;
// //      }
    
// //      startCamera() {
// //          this.showPhotoOptionsModal = false; // Close the photo options modal
// //          this.showCamera = true; // Show the camera interface
// //          navigator.mediaDevices.getUserMedia({ video: true })
// //              .then(stream => {
// //                  this.mediaStream = stream;
// //                  this.liveVideo.nativeElement.srcObject = stream;
// //              })
// //              .catch(error => {
// //                  console.error('Error accessing camera:', error);
// //                  // Optionally, show an error message to the user
// //              });
// //      }
      
      
      
    
    
// //      handleCapturedPhoto(file: File) {
// //        const reader = new FileReader();
// //        reader.onload = (e: any) => {
// //          this.capturedImage = e.target.result;
// //          this.newPost.image = e.target.result;
// //          this.newPost.video = null;
// //        };
// //        reader.readAsDataURL(file);
// //      }
    
    
// //      stopCamera() {
// //        if (this.mediaStream) {
// //          this.mediaStream.getTracks().forEach(track => track.stop());
// //        }
// //        this.showCamera = false;
// //      }
// //     // =============================================SHORTS=============================================================
    
    

// //     likeShort(postId: number, userId: number) {
// //       this.fusionService.performShortVideoAction('like', postId, userId).subscribe(
// //         response => {
// //           // Update the UI here
// //           const short = this.reorderedShorts.find(s => s.id === postId);
// //           if (short) {
// //             short.liked = !short.liked;
// //             short.likes += short.liked ? 1 : -1;
// //           }
// //         },
// //         error => console.error('Error liking short:', error)
// //       );
// //     }
// //     shareShort(postId: number, userId: number) {
// //       const post = this.reorderedShorts.find(p => p.id === postId);
// //       if (!post) {
// //         console.error(`Post with id ${postId} not found`);
// //         return;
// //       }
    
// //       if (navigator.share) {
// //         navigator.share({
// //           title: `Check out this short video`,
// //           url: post.url
// //         }).then(() => {
// //           console.log('Content shared successfully');
// //           this.fusionService.performShortVideoAction('share', postId, userId).subscribe(
// //             response => {
// //               console.log('Share count incremented successfully');
// //               post.shares++;
// //             },
// //             error => {
// //               console.error('Error incrementing share count:', error);
// //             }
// //           );
// //         }).catch((error) => {
// //           if (error.name !== 'AbortError') {
// //             console.error('Error sharing content:', error);
// //           } else {
// //             console.log('Share dialog was closed without sharing');
// //           }
// //         });
// //       } else {
// //         console.log('Web Share API is not supported in your browser.');
// //       }
// //     }
    
    
    
// //     addCommentToShorts(postId: number, userId: number, commentText: string) {
// //       const post = this.reorderedShorts.find(p => p.id === postId);
// //       if (!post) {
// //         console.error(`Post with id ${postId} not found`);
// //         return;
// //       }
    
// //       this.fusionService.performShortVideoAction('comment', postId, userId, commentText ).subscribe(
// //         response => {
// //           console.log('Comment added successfully', response);
// //           if (!this.comments[postId]) {
// //             this.comments[postId] = [];
// //           }
// //           this.comments[postId].push(response);
// //         },
// //         error => console.error('Error adding comment:', error)
// //       );
// //     }
    
// // likeCommentShort(postId: number, commentId: string, userId: number) {
// //   this.fusionService.performShortVideoAction('likeComment', postId, userId, commentId ).subscribe(
// //     response => {
// //       console.log('Comment liked successfully');
// //       const comment = this.comments[postId].find(c => c.id === commentId);
// //       if (comment) {
// //         comment.liked = !comment.liked;
// //         comment.likes += comment.liked ? 1 : -1;
// //       }
// //     },
// //     error => console.error('Error liking comment:', error)
// //   );
// // }
  
  
  
// // replyToCommentShort(postId: number, parentCommentId: number, userId: number, replyContent: string): void {
// //   if (!replyContent.trim()) {
// //     console.error('Reply content cannot be empty');
// //     return;
// //   }

// //   this.fusionService.performShortVideoAction('replyComment', postId, userId, replyContent, parentCommentId).subscribe(
// //     response => {
// //       console.log('Reply added successfully', response);
// //       // Find the comment and add the reply
// //       const comment = this.comments[postId].find(c => c.id === parentCommentId);
// //       if (comment) {
// //         if (!comment.replies) {
// //           comment.replies = [];
// //         }
// //         comment.replies.push(response);
// //         this.replyContent[parentCommentId] = ''; // Clear the input field for that comment
// //       }
// //     },
// //     error => console.error('Error adding reply:', error)
// //   );
// // }

// // openCommentSection(shortId: number) {
// //   this.openCommentId = shortId;
// // }

// // // Method to close the comment section
// // closeCommentSection() {
// //   this.openCommentId = null;
// // }

// // // Method to check if the comment section is open
// // isCommentSectionOpen(shortId: number): boolean {
// //   return this.openCommentId === shortId;
// // }
// //     fetchCommentsShort(postId: number, userId: number) {
// //       this.fusionService.performShortVideoAction('getComments', postId, userId).subscribe(
// //         comments => {
// //           this.comments[postId] = comments;
// //         },
// //         error => console.error('Error fetching comments:', error)
// //       );
// //     }



// //     openComments(postId: number): void {
// //       const post = this.reorderedShorts.find(p => p.id === postId);
// //       if (!post) {
// //         console.error(`Post with id ${postId} not found`);
// //         return;
// //       }
    
// //       post.showComments = !post.showComments;
// //       if (post.showComments && !this.comments[postId]) {
// //         this.fetchCommentsShort(postId,this.userId);
// //       }
// //     }







   
// //      image(toolImage: any) {
// //        return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${toolImage}`);
// //      }
// //      // ----------- getartcialcomments----------
   
// //      // returnArticalComments(articalId: any): Observable<any> {
// //      //   return this.fusionService.getArticalCommentsByArtcialId(articalId);
// //      // }
  
    
    
// //      navigateToSavedItems(): void {
// //       const id = this.authService.getId();
// //       if (id) {
// //         this.router.navigate(['/profile', id], { queryParams: { tab: 'SavedItems' } });
// //       } else {
// //         // If no ID is available, navigate to the general profile page with the SavedItems tab
// //         this.router.navigate(['/profile'], { queryParams: { tab: 'SavedItems' } });
// //       }
// //     }
// //       navigateToProfile(): void {
// //         const id = this.authService.getId();
// //         if (id) {
// //           this.router.navigate([`/profile/${id}`]);
// //         } else {
// //           console.error('User ID not found. Unable to navigate to profile.');
// //         }
// //       }
// //       // navigateToProfile(): void {
// //       //   const id = 2; // Hardcoding the ID to 1 as per your request
// //       //   this.router.navigate(['/usersprofile', id]);
// //       // }
// //      navigateToSuggestionsTab() {
// //        // Replace '123' with the actual userId or dynamically fetch userId
// //        const userId = '123';
// //        this.router.navigate(['/profile', userId], { fragment: 'Suggestions' });
// //      }
// //      navigateToCourseDashboard(){
// //        this.router.navigate(['/candidateview'])
    
// //      }
// //    }
    
    
    