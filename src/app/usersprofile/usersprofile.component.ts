 
 
 
import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, catchError, firstValueFrom, forkJoin, map, mergeMap, of, shareReplay, takeUntil } from 'rxjs';
// import { User, UserService } from '../user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { ArticleService } from '../article.service';
import { FusionService } from '../fusion.service';
import { ImagePostService } from '../image-post.service';
import { VideoService } from '../video.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User,UsersprofileService } from '../usersprofile.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../course.service';
import { formatDistanceToNow } from 'date-fns';
 
 
 
@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number, currency: string): string {
    switch (currency.toUpperCase()) {
      case 'INR':
        return `₹${value}`;
      case 'USD':
        return `$${value}`;
      case 'EURO':
        return `€${value}`;
      default:
        return `${value}`;
    }
  }
}
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
  viewCount:number;
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
  commentCount:number;
  totalComments:number;
  likeCount:number;
  shareCount:number;
  shortVideoDescription:string;
}
interface Course {
  id: number;
  courseTitle: string;
  courseDescription: string;
  courseFee: number;
  courseImage: string;
  courseType: string;
  courseLanguage: string;
  level: string;
  user: {
    name: string;
    profession:string;
   
  };
  courseDuration: any;
  currency: string;
  projectProgress: number;
  enroled: any;
  rating$: Observable<number>;
  enrollmentCount$: Observable<number>;
}
 
 
@Component({
  selector: 'app-usersprofile',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    CustomCurrencyPipe,
    ReactiveFormsModule,
    AsyncPipe,RouterLink,
    ProgressBarModule,
    ProgressSpinnerModule,
    NgxPaginationModule,
   
 
],
   templateUrl: './usersprofile.component.html',
  styleUrl: './usersprofile.component.css'
})
export class UsersprofileComponent implements OnInit ,OnDestroy{
 
  // cards
  hasAnyCourses: boolean = false;
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();
  filteredCourses$ = new BehaviorSubject<Course[]>([]);
  searchTerm: string = '';
  isLoading: boolean = false;
 
  page:
  number
  = 1;
 
 
 
  private destroy$ = new Subject<void>();
   
 
  private subscriptions: Subscription = new Subscription();
  activeSection: string = 'media'; // Default active section
  activeSubSection: string = 'photos'; // Default active subsection in Media
 
 
 
  userId!: number;
  // userId:number;
  name: string | null = '';
  user: any = null;
  noCourses: boolean = false;  // Ensure this is declared only once
  noCoursesMessage: string = 'No courses available';  // Add this property
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
  posts: any[] = [];
  activeTab: string = 'about';
 
  // likeCount$: Observable<number>;
  isMentor: boolean = false;
 
  newComment: string = '';
  newVideoComment: string = '';
  selectedFile: any;
  local: any;
  cuserId: any;
 
  loading: boolean = true;
  error: string | null = null;
 
  private friendsSubject = new BehaviorSubject<User[]>([]);
  friends$ = this.friendsSubject.asObservable();
 
  private usersSubject = new BehaviorSubject<User[]>([]);
 
 
//   private followerCount = new BehaviorSubject<number>(0);
// followingCount = new BehaviorSubject<number>(0);
 
 
  followerCount$: Observable<number>;
  followingCount$: Observable<number>;
  followrequest: any;
  arr: any;
 
  sentFollowRequests: number[] = [];
  sentRequestUsers: any[];
  friends:any[];
 
 
 
 
  private followersSubject = new BehaviorSubject<User[]>([]);
  private followingSubject = new BehaviorSubject<User[]>([]);
  followers$ = this.followersSubject.asObservable();
  following$ = this.followingSubject.asObservable();
//  =============================================================================
replyingTo: { [commentId: number]: boolean } = {};
  newReply: { [commentId: number]: string } = {};
  replies: { [commentId: number]: Comment[] } = {};
 
  repliesVisible: any = {}; // To track the visibility of replies
 
  openCommentId: number | null = null;
 
  showReplies: { [key: number]: boolean } = {}; // To keep track of the replies visibility
 
  replyContent: { [commentId: number]: string } = {};
 
  comments: { [key: string]: any[] } = {};
 
  editContent: { [key: string]: string } = {};
 
  editingComment: { [key: string]: boolean } = {};
 
 
  editingNestedComment: { [commentId: number]: boolean } = {};
  editNestedContent: { [commentId: number]: string } = {};
  isVideo?: boolean=false;;
 
  videoId: number = 1;
  post = { title: '', content: '', likes: 0, comments: [], liked: false };
  isPostMode:boolean=false;
  commentCount: number = 0; // Variable to hold comment count
  reorderedShorts: any[] = [];
  likes: number = 0; // Initialize likes
  content: string='';
  filteredPosts: any[] = []; // Array to hold filtered posts
 
  images: Post[] = [];
  articles: Post[] = [];
  combinedPosts: Post[] = [];
  videos: Post[] = [];
  private currentPlayingVideo: HTMLVideoElement | null = null;
  isFullScreenView: boolean = false;
  private observer: IntersectionObserver | null = null;
// =============================================================================
 
  articleView: 'grid' | 'full' = 'grid';
  selectedPhoto: any = null;
  showFullPosts: boolean = false;
  startIndex: number = 0;
  rearrangedPhotos: any[] = [];
  showFullVideoPosts = false;
  rearrangedVideos: any[] = [];
  rearrangedArticles:any[] = [];
  showFullArticles:boolean = false
  editingItem: any = null;
  editingItemType: 'photo' | 'video' | 'article' | 'short' | null = null;  shorts: any[] = [];
  showFullShortsPosts = false;
  rearrangedShorts: any[] = [];
  savedItems: any[] = []; // Populate this with your saved items data
  showFullSavedItems: boolean = false;
  rearrangedSavedItems: any[] = [];
  currentPage: number = 1;
coursesPerPage: number = 10;
  // userId: number | null = null;
  photoUrl: string | ArrayBuffer | null = null;
 
 
 
  constructor(
 
    // cards
 
    private snackBar: MatSnackBar,  
     private courseService: CourseService,
     
 
 
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: AuthService,
    private articleService: ArticleService,
    private userService:UsersprofileService,
    private fusionService: FusionService,
    private imagePostService: ImagePostService,
    private videoService: VideoService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    this.followRequests$ = this.userService.followRequests$;
    this.followerCount$ = this.userService.followerCount$;
    this.followingCount$ = this.userService.followingCount$;
    this.filteredCourses$ = new BehaviorSubject<Course[]>([]);
    this.sentRequestUsers = [];
    this.friends=[];
 
 
 
  }
  onRouteChange(userId: string) {
    this.loadUserProfile(userId);
  }
  getSafeImageUrl(imageData: string | null | undefined): SafeUrl | null {
    if (imageData) {
      return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${imageData}`);
    }
    return null;
  }
  ngOnInit(): void {
 
    this.loadAllPosts()
 
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.userId = Number(userId);
        this.loadUserProfile(userId);
        this.fetchFollowerAndFollowingCounts();
     
      }
    });
     
 
 
   
     
 
    this.fetchUserDetails();
   
 
 
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
 
 
    this.userService.followRequests$.subscribe(requests => {
      console.log('Follow requests updated:', requests);
      this.cdr.markForCheck();
    });
   
    this.getUserDetails(this.currentUser.id);
   
    this.userService.users$.subscribe(users => {
      this.users = users;
    });
   
    this.userService.followRequests$.subscribe(requests => {
      console.log('Follow requests:', requests);
    });
    this.setActiveTab('articles'); // Ensure articles are loaded initially
 
    this.updateCounts();
    this.fetchFollowing();
    this.fetchFollowers();
   
    this.userService.followRequests$.subscribe(requests => {
      console.log('Updated follow requests:', requests);
      // Update your component's state or trigger change detection if necessary
    });
 
   
    const currentUserId = this.userId;
    if (currentUserId) {
     
      this.userService.updateFollowerCount(Number(this.userId));
      this.userService.updateFollowingCount(Number(this.userId));
    }
    this.subscriptions.add(
      this.users$.subscribe(() => this.cdr.markForCheck())
    );
 
    this.subscriptions.add(
      this.followRequests$.subscribe(() => this.cdr.markForCheck())
    );
 
    this.subscriptions.add(
      this.followerCount$.subscribe(() => this.cdr.markForCheck())
    );
 
    this.subscriptions.add(
      this.followingCount$.subscribe(() => this.cdr.markForCheck())
    );
   
    this.userService.followRequests$.subscribe(requests => {
      console.log('Follow requests updated:', requests);
      this.cdr.markForCheck();
    });
   
 
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
 
 
  updateCounts() {
    const userId = this.userId;
    this.userService.updateFollowerCount(Number(userId));
    this.userService.updateFollowingCount(Number(userId));
  }
 
  updateUsersList(): void {
    this.users$.pipe(
      map(users => users.map(user => ({
        ...user,
        followRequested: this.sentFollowRequests.includes(user.id)
      })))
    ).subscribe(updatedUsers => {
      this.usersSubject.next(updatedUsers);
    });
  }
 
 
  loadUserProfile(userId: string) {
  this.loading = true;
  this.error = null;
  this.userId = Number(userId);
 
  forkJoin({
    userInfo: this.fusionService.getUserById(userId),
    articles: this.articleService.getArticlesByUserId(this.userId),
    photos: this.imagePostService.getAllImagePostsByUserId(this.userId),
    videos: this.videoService.getVideosByUserId(this.userId),
    shorts: this.videoService.getShortsByUserId(this.userId),
    followerCount: this.userService.getFollowerCount(this.userId),
    followingCount: this.userService.getFollowingCount(this.userId)
  }).subscribe(
    (data) => {
      this.user = data.userInfo;
      this.updateUserImage(this.user.userImage);
      this.articles = data.articles;
      // this.photos = data.photos;
      this.videos = data.videos;
      this.shorts = data.shorts;
      this.followerCount = data.followerCount;
      this.followingCount = data.followingCount;
      this.fetchFollowers();
      this.fetchFollowing();  
      this.fetchAllCoursesWithDetails();
      this.checkIfMentor();
     
   
     
      this.loadAllPosts();
     
      this.loading = false;
    },
    (error) => {
      console.error('Error fetching user profile data:', error);
      this.error = 'Failed to load user profile. Please try again.';
      this.loading = false;
    }
  );
}
updateUserImage(imageData: string | null) {
  if (imageData) {
    this.userImage = this.getSafeImageUrl(imageData);
  } else {
    this.userImage = null;
  }
  this.cdr.detectChanges(); // Trigger change detection
}
 
 
 
   // Following
   fetchFollowing(): void {
    const currentUserId = this.userId;
    if (currentUserId) {
      this.friends$ = this.http.get<any[]>(`${environment.apiBaseUrl}/follow/followersWithCountEqualsToOne/${currentUserId}`).pipe(
        map(friends => friends.map(friend => {
          const isCurrentUserFollower = friend.follower.id === Number(currentUserId);
          const friendData = isCurrentUserFollower ? friend.following : friend.follower;
          return {
            id: friendData.id,
            name: friendData.name,
            profession: friendData.profession,
            userImage: friendData.userImage,
            isFollowed: true,
            followRequested: false,
            isAccepted: true
          } as User;
        })),
        mergeMap(friends => forkJoin(
          friends.map(friend =>
            forkJoin({
              followerCount: this.userService.getFollowerCount(friend.id),
              followingCount: this.http.get<number>(`${environment.apiBaseUrl}/follow/sumFollowingCounts/${friend.id}`)
            }).pipe(
              map(({ followerCount, followingCount }) => ({ ...friend, followersCount: followerCount, followingCount }))
            )
          )
        )),
        catchError(error => {
          console.error('Error fetching friends:', error);
          return of([]);
        })
      );
    } else {
      console.error('No user is currently logged in');
      this.friends$ = of([]);
    }
  }
  // Followers
  fetchFollowers(): void {
    const currentUserId = this.userId;
    if (currentUserId) {
      this.followers$ = this.http.get<any[]>(`${environment.apiBaseUrl}/follow/followingWithCountEqualsToOne/${currentUserId}`).pipe(
        map(followers => followers.map(follower => {
          const followerData = follower.follower.id === this.userId ? follower.following : follower.follower;
          return {
            id: followerData.id,
            name: followerData.name,
            profession: followerData.profession,
            userImage: followerData.userImage,
            isFollowed: true,
            followRequested: false,
            isAccepted: true
          } as User;
        })),
        mergeMap(followers => forkJoin(
          followers.map(follower =>
            forkJoin({
              followerCount: this.userService.getFollowerCount(follower.id),
              followingCount: this.http.get<number>(`${environment.apiBaseUrl}/follow/sumFollowingCounts/${follower.id}`)
            }).pipe(
              map(({ followerCount, followingCount }) => ({ ...follower, followersCount: followerCount, followingCount }))
            )
          )
        )),
        catchError(error => {
          console.error('Error fetching followers:', error);
          return of([]);
        })
      );
    } else {
      console.error('No user ID available');
      this.followers$ = of([]);
    }
  }
  setCurrentUser(user: { id: number; name: string; followers: number; following: number }): void {
    this.currentUser = user;
    console.log('Current user set to:', this.currentUser);
   
 
  }
 
  setActiveTab(tab: string) {
    this.activeTab = tab;
 
  }
 
  followUser(userId: number) {
    this.sentFollowRequests.push(userId);
    this.updateUsersList();
  }
  toggleArticleView(view: 'grid' | 'full') {
    this.articleView = view;
  }
  openArticle(article: any) { // Replace 'any' with your Article type
    this.articleView = 'full';
   
  }
  loadArticles() {
    this.articleService.getArticlesByUserId(Number(this.userId)).subscribe(
      articles => {
        this.articles = articles;
        console.log('Articles loaded:', this.articles);
        console.log('Active tab:', this.activeTab);
        console.log('Article view:', this.articleView);
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error loading articles:', error);
      }
    );
  }
 
 
  likeArticle(postId: number) {
    this.articleService.likeArticle(postId, Number(this.userId)).subscribe(() => {
      this.loadArticles();
    });
  }
 
  shareArticle(postId: number) {
    this.articleService.shareArticle(postId).subscribe(() => {
      this.loadArticles();
    });
  }
 
  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      user => {
        this.user = user;
        console.log('User details:', this.user);
        this.fetchFollowerAndFollowingCounts(); // Remove the userId parameter
      },
      error => console.error('Error fetching user details:', error)
    );
  }
 
  getUserNameById(userId: number): Observable<User> {

    return this.http.get<User>(`http://54.162.40.172:8080/user/find/${userId}`).pipe(

    // return this.http.get<User>(`http://54.162.40.172:8080/user/find/${userId}`).pipe(

      catchError(error => {
        console.error('Error fetching user details', error);
        return of({ id: userId, name: 'Unknown User' } as User);
      })
    );
  }
  // ======================================================================
 
  getCommentsByArticle(articleId: number): void {
    this.articleService.getCommentsByArticleId(articleId)
      .subscribe(
        comments => {
          console.log('Comments for article', articleId, ':', comments); // Debug log
          const article = this.articles.find(article => article.id === articleId);
          if (article) {
            article.comments = comments;
          }
        },
        error => {
          console.error('Error loading comments:', error); // Debug error
        }
      );
  }
 
 
 
  // ==========================================================================================
  // images
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const dropdowns = document.getElementsByClassName('options-dropdown');
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
 
  showFullPostsFrom(index: number) {
    // Rearrange the photos array
    this.rearrangedPhotos = [
      ...this.images.slice(index),
      ...this.images.slice(0, index)
    ];
    this.showFullPosts = true;
  }
  showFullArticleFrom(index: number) {
    this.rearrangedArticles = [
      ...this.articles.slice(index),
      ...this.articles.slice(0, index)
    ];
    this.showFullArticles = true;
  }
  loadPhotos() {
     const userId = this.authService.getId(); // Get the current user's ID
     this.imagePostService.getAllImagePostsByUserId(Number(userId)).subscribe(
       (photos) => {
         this.images = photos;
         this.cdr.detectChanges();
       },
       
       (error) => {
         console.error('Error loading photos:', error);
       }
     );
   }
 
 
 
   toggleOptions(event: Event) {
    event.stopPropagation();
    const dropdown = (event.target as HTMLElement).nextElementSibling as HTMLElement;
    dropdown.classList.toggle('show');
  }
 
  pinToProfile(itemId: number, itemType: 'photo' | 'article' | 'video') {
    console.log(`Pinning ${itemType}`, itemId);
    // Implement pin to profile functionality
  }
 
 ////
 
toggleOptionsd(event: Event) {
  const dropdown = (event.target as HTMLElement).nextElementSibling as HTMLElement;
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  event.stopPropagation();
}
 ///////////saveditems///////
 
 likeImage(postId: number) {
  this.imagePostService.likeImagePost(postId, this.userId).subscribe(() => {
    this.loadPhotos();
  });
}
 
 
  // ==========================================================================================
  //shorts///////////////
 
  // loadShorts() {
  //   this.videoService.getShortsByUserId(this.userId).subscribe(
  //     shorts => {
  //       console.log('Fetched short object:', shorts); // Check the structure here
  //   this.shareShorts(shorts);
  //       this.shorts = shorts.map(short => ({
  //         ...short,
  //         viewCount:short.shortVideoViews,
  //         profileImage:short.user.userImage,
  //         likeCount: short.shortVideoLikes || 0,
  //         shareCount: short.shortVideoShares || 0,
  //         commentCount: short.videoComments || 0,
  //         comments: short.videoComments || []
  //       }));
  //       console.log('Shorts loaded:', this.shorts);
 
  //       // Example of usage
  //       this.shorts.forEach(short => {
  //         // Ensure `short` is correct
           
  //         this.videoService.getShortCommentCount(short.id).subscribe(
  //           commentCount => short.commentCount = commentCount
  //         );
  //       });
  //     },
  //     error => {
  //       console.error('Error loading shorts:', error);
  //     }
  //   );
  // }
 
  showFullShortsPostsFrom(index: number) {
    this.showFullShortsPosts = true;
    this.rearrangedShorts = [
      ...this.shorts.slice(index),
      ...this.shorts.slice(0, index)
    ];
  }
 
 
  // videos
  showFullVideoPostsFrom(index: number) {
    this.showFullVideoPosts = true;
    this.rearrangedVideos = [
      ...this.videos.slice(index),
      ...this.videos.slice(0, index)
    ];
  }
  loadVideos() {
    this.videoService.getVideosByUserId(this.userId).subscribe(
      videos => {
        this.videos = videos.map(video => ({
          ...video,
          likeCount: 0, // Initialize likeCount if not provided by API
          shareCount: 0, // Initialize shareCount if not provided by API
          commentCount: 0, // Initialize commentCount if not provided by API
          comments: [] // Initialize comments array if not provided by API
        }));
        console.log('Videos loaded:', this.videos); // Debug log
 
        // Load counts for each video
        this.videos.forEach(video => {
          this.videoService.getVideoLikeCount(video.id).subscribe(
            likeCount => video.likeCount = likeCount
          );
          this.videoService.getVideoShareCount(video.id).subscribe(
            shareCount => video.shareCount = shareCount
          );
          this.videoService.getVideoCommentCount(video.id).subscribe(
            commentCount => video.commentCount = commentCount
          );
        });
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error loading videos:', error); // Debug error
      }
    );
  }
 
  likeVideo(videoId: number) {
    this.videoService.likeVideo(videoId).subscribe(() => {
      this.loadVideos();
    });
  }
 
  shareVideo(videoId: number) {
    this.videoService.shareVideo(videoId).subscribe(() => {
      this.loadVideos();
    });
  }
 
  addVideoComment(videoId: number) {
    const comment = this.newVideoComment.trim();
    if (!comment) {
      return;
    }
    this.videoService.addVideoComment(videoId, comment).subscribe(
      newComment => {
        console.log('Comment added successfully:', newComment); // Debug log
        const video = this.videos.find(v => v.id === videoId);
        if (video) {
          if (!video.comments) {
            video.comments = [];
          }
          video.comments.push(newComment);
          this.newVideoComment = ''; // Clear the textarea after adding comment
          this.videoService.getVideoCommentCount(videoId).subscribe(
            count => video.commentCount = count,
            error => console.error('Error updating total comments count:', error)
          );
        }
      },
      error => {
        console.error('Error adding comment:', error); // Debug error
      }
    );
  }
 
  // ============================================================
 
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
 
  onUpload(): void {
    if (this.selectedFile && this.userId !== null) {
      const formData = new FormData();
      formData.append('userImage', this.selectedFile, this.selectedFile.name);
 
      this.userService.updateUserProfileImage(this.userId, formData).subscribe(
        (response) => {
          console.log('Photo uploaded successfully', response);
        },
        (error) => {
          console.error('Error uploading photo', error);
        }
      );
    }
  }
  fetchFollowerAndFollowingCounts(): void {
    if (this.userId) {
      this.userService.getFollowerCount(this.userId).subscribe(
        (result) => {
          this.followerCount = result;
          console.log('Updated follower count:', this.followerCount);
        },
        error => console.error('Error fetching follower count:', error)
      );
     
      this.userService.getFollowingCount(this.userId).subscribe(
        result => {
          this.followingCount = result;
          console.log('Updated following count:', this.followingCount);
        },
        error => console.error('Error fetching following count:', error)
      );
    } else {
      console.error('No user ID available');
    }
  }
 
  role:any;
  userDescription:any;
  userImage: SafeUrl | null = null;
  originalImage: SafeUrl | null = null;
 
 
  fetchUserDetails(): void {
    if (this.userId) {
      this.fusionService.getUserById(this.userId.toString()).subscribe({
        next: (data) => {
          this.user = data;
          this.role = data.role;
          this.userDescription = data.userDescription;
 
          if (data.userImage) {
            const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data.userImage}`);
            this.userImage = sanitizedUrl;
            this.originalImage = sanitizedUrl;
          }
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
        }
      });
    } else {
      console.error('User ID not available');
    }
  }
  navigateToFeed(){
    this.router.navigate(['/feed']);
  }
 
  showSection(section: string) {
    this.activeSection = section;
    this.activeTab = section === 'media' ? 'articles' :
                     section === 'connections' ? 'followers' :
                     section === 'courses' ? '' : '';
  }
 
 
  onFollowingClick() {
    this.activeSection = "connections"
    this.activeTab="friends"
    this.setActiveTab('friends');
  }
  onFollowerClick(){
    this.activeSection = "connections"
    this.activeTab="followers"
    this.setActiveTab('followers');
  }
 
  // ------------------------------------>Cards<-------------------------------------
 
 
 
   
  searchCourses() {
    if (!this.hasAnyCourses) return; // Don't perform search if there are no courses
 
    const filteredCourses = this.coursesSubject.value.filter((course: Course) =>
      course.courseTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredCourses$.next(filteredCourses);
   
    this.noCourses = filteredCourses.length === 0;
   
    if (this.noCourses) {
      this.noCoursesMessage = "We couldn't find any courses matching your search. Please try again later or modify your search criteria.";
    }
  }
 
 
    getEnrollmentCount(courseId: number): Observable<number> {
      return this.http.get<any[]>(`${environment.apiBaseUrl}/course/enrollments/${courseId}`).pipe(
        map(res => res.length),
        catchError(error => {
          console.error("Error fetching enrollments:", error);
          return of(0);
        }),
        shareReplay(1)
      );
    }
 
    getRating(courseId: number): Observable<number> {
      return this.http.get<any[]>(`${environment.apiBaseUrl}/course/reviews/${courseId}`).pipe(
        map(res => {
          if (Array.isArray(res) && res.length > 0) {
            const ratings = res.map(review => review.rating).filter(rating => typeof rating === 'number');
            if (ratings.length > 0) {
              return ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
            }
          }
          return 0;
        }),
        catchError(error => {
          console.error("Error fetching reviews:", error);
          return of(0);
        }),
        shareReplay(1)
      );
    }
 
    image(toolImage: string) {
      return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${toolImage}`);
    }
 
    generateStarsArray(rating: number): number[] {
      return Array(Math.round(rating)).fill(0);
    }
 
    generateEmptyStarsArray(rating: number): number[] {
      return Array(5 - Math.round(rating)).fill(0);
    }
 
    truncateDescription(text: string, limit: number = 100): string {
      return text.length > limit ? text.substring(0, limit) + '...' : text;
    }
    onInstructorSelect(user: any): void {
      if (user && user.id) {
        console.log('Selected instructor:', user);
        this.router.navigate(['/usersprofile', user.id]);
      } else {
        console.error('User object or user ID is undefined');
      }
    }
    formatDuration(durationInMinutes: number): string {
      if (!durationInMinutes || isNaN(durationInMinutes)) {
        return 'Duration not available';
      }
 
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
 
      if (hours === 0) {
        return `${minutes} min${minutes !== 1 ? 's' : ''}`;
      } else if (minutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
      } else {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
      }
    }
 
    private handleError(error: HttpErrorResponse): Observable<null> {
      console.error('API call failed:', error);
      return of(null);
    }
    fetchAllCoursesWithDetails() {
      this.isLoading = true;
      this.http.get<any[]>(`${environment.apiBaseUrl}/course/getByUser/${this.userId}`).pipe(
        mergeMap(courses => {
          if (courses.length === 0) {
            this.noCoursesMessage = 'No courses available';
            this.isLoading = false;
            this.noCourses = true;
            return of([]);
          }
          const courseRequests = courses.map(course =>
            forkJoin({
              course: of(course),
              projectProgress: this.http.get<any>(
                course.courseTerm === 'long'
                  ? `${environment.apiBaseUrl}/video/progressOfCourse/user/${this.userId}/course/${course.id}`
                  : `${environment.apiBaseUrl}/video/courseProgressByLesson/user/${this.userId}/course/${course.id}`
              ).pipe(
                map(progress => progress ?? 0),
                catchError(error => {
                  console.error('Error fetching project progress:', error);
                  return of(0);
                })
              ),
              enroled: this.http.get<any>(`${environment.apiBaseUrl}/enrollment/user/${this.userId}/course/${course.id}`).pipe(
                catchError(error => this.handleError(error))
              )
            }).pipe(
              map(({ course, projectProgress, enroled }) => ({
                ...course,
                projectProgress: projectProgress,
                enroled: enroled || null,
                rating$: this.getRating(course.id),
                enrollmentCount$: this.getEnrollmentCount(course.id)
              })),
              catchError(error => {
                console.error('Error processing course:', course.id, error);
                return of({
                  ...course,
                  projectProgress: 0,
                  enroled: null,
                  rating$: of(0),
                  enrollmentCount$: of(0)
                });
              })
            )
          );
          return forkJoin(courseRequests);
        }),
        catchError(error => {
          console.error('Error fetching courses for user:', error);
          this.isLoading = false;
          this.noCourses = true;
          return of([]);
        })
      ).subscribe(
        coursesWithDetailsAndStats => {
          this.coursesSubject.next(coursesWithDetailsAndStats);
          this.filteredCourses$.next(coursesWithDetailsAndStats);
          this.isLoading = false;
          this.hasAnyCourses = coursesWithDetailsAndStats.length > 0;
          this.noCourses = !this.hasAnyCourses;
          if (!this.hasAnyCourses) {
            this.noCoursesMessage = 'No courses available';
          }
          console.log('Courses with details and stats:', coursesWithDetailsAndStats);
        },
        error => {
          console.error('Unexpected error in subscription:', error);
          this.isLoading = false;
          this.noCourses = true;
          this.hasAnyCourses = false;
          this.noCoursesMessage = 'Error loading courses. Please try again later.';
        }
      );
    }
   
   
    // get noCourses(): boolean {
    //   return this.filteredCourses$.value.length === 0;
    // }
   
    generateEmptyStarsArrayonly(){
      return Array(5).fill(0);
    }
    previousPage() {
      if (this.hasPreviousPage) {
        this.currentPage--;
      }
    }
   
    nextPage() {
      if (this.hasNextPage) {
        this.currentPage++;
      }
    }
 
get totalPages(): number {
  return Math.ceil(this.filteredCourses$.value.length / this.coursesPerPage);
}
 
get hasPreviousPage(): boolean {
  return this.currentPage > 1;
}
 
get hasNextPage(): boolean {
  return this.currentPage < this.totalPages;
}
 
get paginatedCourses(): any[] {
  const startIndex = (this.currentPage - 1) * this.coursesPerPage;
  return this.filteredCourses$.value.slice(startIndex, startIndex + this.coursesPerPage);
}
 
    recommendations: any[] = [];
 
checkIfMentor() {
  if (this.userId) {
    this.http.get<boolean>(`${environment.apiBaseUrl}/user/users/${this.userId}/is-mentor`)
      .subscribe(
        (response: boolean) => {
          this.isMentor = response;
          if (this.isMentor) {
            this.fetchAllCoursesWithDetails();
          }
        },
        (error) => {
          console.error('Error checking mentor status:', error);
        }
      );
  }
}
 
// ------------------------------------------------------
 
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
  console.log('Short object before sharing:', short);
 
  // Check if short is a number (likely the short.id was passed instead of the whole object)
  if (typeof short === 'number') {
    console.log('Short ID was passed instead of short object. Converting to object.');
    short = { id: short };
  }
 
  if (!short || typeof short !== 'object' || !short.id) {
    console.error('Error: Invalid short object', short);
    return;
  }
 
  // Ensure s3Url exists, if not, construct a fallback URL
  if (!short.s3Url) {
    console.warn('s3Url not found in short object. Using fallback URL.');
    short.s3Url = `https://your-domain.com/short/${short.id}`;  // Replace with your actual domain
  }
 
  if ('share' in navigator) {
    navigator.share({
      title: `Check out this short video`,
      url: short.s3Url
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
  dummy.value = short.s3Url; // Assuming 's3Url' contains the URL of the short video
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
 
  alert('Short video link copied to clipboard. You can now paste it to share.');
}
 
private incrementShortShareCount(short: any): void {
  console.log('Incrementing share count for short:', short);
 
  if (!short || !short.id) {
    console.error('Error: Invalid short object', short);
    return;
  }
 
  const userId = this.userId; // Ensure `userId` is defined
  if (!userId) {
    console.error('Error: userId is undefined');
    return;
  }
 
  this.fusionService.performShortVideoAction('share', short.id, userId).subscribe(
    response => {
      console.log('Short share count incremented successfully', response);
      short.shareCount = (short.shareCount || 0) + 1; // Safely increment shareCount
    },
    error => {
      console.error('Error incrementing short share count:', error.message || error);
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
   
   
   
  addCommentToShorts(shortId: number, userId: number, commentText: string) {
  // Find the post in the reorderedShorts array
  // const post = this.reorderedShorts.find(p => p.id === shortId);
  // if (!post) {
  //   console.error(`Post with id ${shortId} not found`);
  //   return;
  // }
   
  // Make an API call to add the comment
  this.fusionService.performShortVideoAction('comment', shortId, userId, commentText).subscribe(
    response => {
      console.log('Comment added successfully', response);
     
      // Ensure the comments array for this post exists
      if (!this.comments[shortId]) {
        this.comments[shortId] = [];
      }
   
      // Add the new comment at the beginning of the array (unshift)
      this.comments[shortId].unshift(response);
   
      // Trigger change detection by creating a new array reference
      this.comments[shortId] = [...this.comments[shortId]];
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
  if (this.openCommentId === shortId) {
    this.closeCommentSection();
  } else {
    this.openCommentId = shortId;
    this.fetchCommentsShort(shortId, this.userId);
  }
  }
   
  // Method to close the comment section
  closeCommentSection() {
  this.openCommentId = null;
  }
   
  isCommentSectionOpen(shortId: string): boolean {
  const short = this.shorts.find(s => s.id === shortId);
  return short ? short.showComments : false;
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
  console.log('Opening comments for post:', postId);
  console.log('Current reorderedShorts:', this.reorderedShorts);
   
  if (this.reorderedShorts.length === 0) {
    console.warn('reorderedShorts is empty. Fetching shorts data...');
    this.fetchShortsData(postId);
    return;
  }
   
  const post = this.reorderedShorts.find(p => p.id === postId);
  if (!post) {
    console.error(`Post with id ${postId} not found in reorderedShorts`);
    return;
  }
   
  post.showComments = !post.showComments;
  if (post.showComments && !this.comments[postId]) {
    this.fetchCommentsShort(postId, this.userId);
  }
  }
  private fetchShortsData(postId: number): void {
  // Implement this method to fetch the shorts data
  // This should populate the reorderedShorts array
  this.videoService.getShortsByUserId(this.userId).subscribe(
    (shorts: any[]) => {
      this.reorderedShorts = shorts;
      console.log('Fetched shorts data:', this.reorderedShorts);
      // Now that we have the data, try opening comments again
      this.openComments(postId);
    },
    error => {
      console.error('Error fetching shorts data:', error);
    }
  );
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
   
  transformToPostFormat(item: any, type: 'video' | 'image' | 'article'): Post {
  const createImageSrc = (imageData: string): string => {
    if (imageData.startsWith('data:image')) {
      return imageData;
    } else if (imageData.startsWith('http') || imageData.startsWith('https')) {
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
        createdAt: new Date(comment.createdAt).toISOString(),
      })) :
      [];
  } catch (error) {
    console.error('Error mapping comments:', error);
  }
   
   
  return {
    id: item.id,
    type,
    url: '',
    description: item.description || '',
    title: item.title || '',
    isVideo: type === 'video',
    isImage: type === 'image',
    isArticle: type === 'article',
    src: type === 'image' ? createImageSrc(item.photo) :
         (type === 'video' ? item.s3Url : ''),
    likes: type === 'article' ? item.articleLikeCount || 0 :
           (type === 'image' ? item.imageLikeCount || 0 :
           (type === 'video' ? item.longVideoLikes || 0 : 0)),
    shares: type === 'article' ? item.articleShareCount || 0 :
            (type === 'image' ? item.imageShareCount || 0 :
            (type === 'video' ? item.longVideoShares || 0 : 0)),
    views: type === 'video' ? item.longVideoViews || 0 : 0,
    timestamp: item.postDate,
    createdAt: item.createdAt,
    commentDate: item.commentDate,
    comments: mappedComments,
    showComments: false,
    liked: false,
    likeCount:0,
    shareCount:0,
    commentCount:0,
     totalComments:0,
    shortVideoDescription:'',
    showShareMenu: false,
    saved: false,
    userId: item.user?.id || 0,
    profileImage:'',
    profileName: item.user?.name || 'Unknown User',
    content: type === 'article' ? item.article || '' :
             (type === 'image' ? item.imageDescription || '' :
             item.longVideoDescription || ''),
    showFullContent: false,
    showShareModal: false,
    videoCommentContent: item.videoCommentContent || [],
    text: item.text || [],
    shortVideoLikes: type === 'video' ? item.shortVideoLikes || 0 : 0,
    shortVideoShares: type === 'video' ? item.shortVideoShares || 0 : 0,
    shortVideoViews: type === 'video' ? item.shortVideoViews || 0 : 0
  };
  }
   
  getVideos(): Observable<any[]> {
  return this.fusionService.getAllUserLongVideos(this.userId).pipe(
    map(data => data.map(video => this.transformToVideoFormat(video, 'video')))
   
  );
   
  }
   
  getImages(): Observable<any[]> {
  return this.fusionService.getAllUserImagePosts(this.userId).pipe(
    map(data => data.map(image => this.transformToVideoFormat(image, 'image')))
  );
   
  }
   
  getArticles(): Observable<any[]> {
  return this.fusionService.getAllUserArticlePosts(this.userId).pipe(
    map(data => data.map(article => this.transformToVideoFormat(article, 'article')))
  );
  }
   
  updateCombinedPosts(): void {
  this.combinedPosts = [...this.videos, ...this.images, ...this.articles];
   
  }
   
  transformToVideoFormat(item: any, type: 'video' | 'image' | 'article'): Post {
  const createImageSrc = (imageData: string): string => {
   
    if (imageData.startsWith('data:image')) {
      return imageData;
    } else if (imageData.startsWith('http') || imageData.startsWith('https')) {
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
    description: (type === 'image' ? item.imageDescription || '' : item.longVideoDescription || ''),
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
   
    commentCount:0, totalComments:0, likeCount:0, shareCount:0, shortVideoDescription:'',
    // share: item.shareCount || 0,
    showComments: false,
    liked: false,
    showShareMenu: false,
    views:type === 'video' ? item.longVideoViews || 0 : 0,
   
    saved: false,
    userId: item.user?.id || 0, // Add this line, with a default
   
    profileImage,
    profileName: item.user?.name || 'Unknown User',
    content:item.article,
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
  } else if (imageData.startsWith('http') || imageData.startsWith('https')) {
  return this.sanitizer.bypassSecurityTrustUrl(imageData);
  } else {
  // Assuming imageData is base64 encoded JPEG
  return this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${imageData}`);
  }
  }
   
  updateFilteredPosts() {
  if (this.activeTab === 'videos') {
    this.filteredPosts = this.combinedPosts.filter(post => post.isVideo);
  } else if (this.activeTab === 'photos') {
    this.filteredPosts = this.combinedPosts.filter(post => post.isImage);
  } else if (this.activeTab === 'articles') {
    this.filteredPosts = this.combinedPosts.filter(post => post.isArticle);
  }
  }
  loadAllPosts(): void {
  forkJoin({
    videos: this.getVideos(),
    images: this.getImages(),
    articles: this.getArticles()
  }).subscribe({
    next: (result) => {
      this.combinedPosts = [
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
      this.updateFilteredPosts();
   
      console.log('Combined and sorted posts:', this.combinedPosts);
   
      this.combinedPosts.forEach(post => this.checkLikeStatus(post));
   
      console.log('checkLikeStatus:', this.checkLikeStatus(this.post));
   
   
   
    },
    error: (error) => console.error('Error fetching posts:', error)
  });
  }
  isPostVisible(post: any): boolean {
  return (this.activeTab === 'articles' && post.isArticle) ||
         (this.activeTab === 'photos' && post.isImage) ||
         (this.activeTab === 'videos' && post.isVideo) ||
         (this.activeTab === 'shorts' && post.isShort);
  }
   
  getIconClass(): string {
  const iconMap: {[key: string]: string} = {
    'articles': 'fa-solid fa-newspaper',
    'photos': 'fa-solid fa-image',
    'videos': 'fa-solid fa-video',
    'shorts': 'fa-solid fa-film'
  };
  return iconMap[this.activeTab] || '';
  }
   
   
  selectPost(post: any) {
  const element = document.getElementById('post-' + post.id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  }
   
  truncate(text: string, length: number): string {
  return text.length > length ? text.substring(0, length) + '...' : text;
  }
  playVideo(video: HTMLVideoElement): void {
  if (this.currentPlayingVideo && this.currentPlayingVideo !== video) {
    this.currentPlayingVideo.pause();
  }
  video.play();
  this.currentPlayingVideo = video;
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
  // getShorts(): void {
  // this.fusionService.getAllUserShortVideos(this.userId).subscribe(
  //   (data) => {
  //     this.shorts = data;
  //     console.log('Shorts data:', this.shorts);
  //   },
  //   (error) => console.error('Error fetching videos:', error)
  // );
  // }
   
   
  toggleCommentsShorts(short: any) {
  if (!short.showComments) {
    // Open comment section
    short.showComments = true;
    this.fetchCommentsShort(short.id, this.userId);
   
    console.log('Opening comments for short ID:', short.id);
  } else {
    // Close comment section
    short.showComments = false;
   
    console.log('Closing comments for short ID:', short.id);
  }
  }
   
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
  formatViewCount(viewCount: number): string {
    if (viewCount >= 1_000_000) {
      return `${(viewCount / 1_000_000).toFixed(1)}M`;
    } else if (viewCount >= 1_000) {
      return `${(viewCount / 1_000).toFixed(1)}K`;
    } else {
      return `${viewCount}`;
    }
  }
  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.click();
  }
  handleImageError(event: any) {
    console.error('Image failed to load:', event.target.src);
    event.target.src = 'assets/default-avatar.png';  // Make sure this file exists in your assets folder
  }
    }
   
   
   
   
   
   
   
   
   
   
   