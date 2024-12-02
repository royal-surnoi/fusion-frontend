import { ChangeDetectorRef, Component, HostListener, OnInit ,ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';
import { UserService, User } from '../user.service';
import { FusionService } from '../fusion.service';
import { ArticleService } from '../article.service';
import { CommonModule } from '@angular/common';
import { Subscription,Observable, catchError, of,map,tap,switchMap,forkJoin,BehaviorSubject,EMPTY, Subject, takeUntil, firstValueFrom, mergeMap, finalize} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ImagePostService } from '../image-post.service';
import { VideoService } from '../video.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { formatDistanceToNow } from 'date-fns';

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
  isEditing: boolean;
  showMenu: boolean;


} 
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
changeDetection: ChangeDetectionStrategy.OnPush
 
})
export class ProfileComponent  implements OnInit ,OnDestroy{
 
 
  private destroy$ = new Subject<void>();
   
  followRequests: User[] = [];
  private subscriptions: Subscription = new Subscription();
 
  userId!: number;
  // userId:number;
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
  newImage: SafeUrl | null = null;

  // followRequests$ = this.userService.followRequests$;
  users: User[] = [];
  posts: any[] = [];
  activeTab: string = 'about';
 
  newComment: string = '';
  newVideoComment: string = '';
  selectedFile: any;
  local: any;
  cuserId: any;
  
  editingPost: any = null;



  activeSection: string = 'media'; // Default active section
  
    activeSubSection: string = 'photos'; // Default active subsection in Media
   
    showSection(section: string) {
  
      this.activeSection = section;
  
      this.activeTab = section === 'media' ? 'articles' : section === 'connections' ? 'Suggestions' : '';
      this.updateFilteredPosts(); // Update posts when section changes

    }
   
    showSubSection(subSection: string) {
  
      this.activeTab = subSection;
      this.updateFilteredPosts(); // Update posts when section changes

    }
   
    isDropdownOpen:boolean = false;
   
    toggleDropdown() {
  
      this.isDropdownOpen = !this.isDropdownOpen;
  
      // Optionally, close dropdown if clicking outside
  
      if (this.isDropdownOpen) {
  
        document.addEventListener('click', this.closeDropdown.bind(this));
  
      } else {
  
        document.removeEventListener('click', this.closeDropdown.bind(this));
  
      }
  
    }
   
    closeDropdown(event: Event) {
  
      const target = event.target as HTMLElement;
  
      if (!target.closest('.horizontal-navbar')) {
  
        this.isDropdownOpen = false;
  
        document.removeEventListener('click', this.closeDropdown.bind(this));
  
      }
  
    }
   
 
  private friendsSubject = new BehaviorSubject<User[]>([]);
  friends$ = this.friendsSubject.asObservable();
 
  private usersSubject = new BehaviorSubject<User[]>([]);
 
 
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
//  ============================================FEED=================================
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
// ==============================================================================
 
  articleView: 'grid' | 'full' = 'grid';
  selectedPhoto: any = null;
  showFullPosts: boolean = false;
  startIndex: number = 0;
  rearrangedPhotos: any[] = [];
  showFullVideoPosts = false;
  rearrangedVideos: Post[] = [];
  rearrangedArticles:any[] = [];
  showFullArticles:boolean = false;
  editingItem: any = null;
  editingItemType: 'photo' | 'video' | 'article' | 'short' | null = null;  shorts: any[] = [];
  showFullShortsPosts = false;
  rearrangedShorts: any[] = [];
  savedItems: any[] = [];
  showFullSavedItems: boolean = false;
  rearrangedSavedItems: any[] = [];
  photoUrl: string | ArrayBuffer | null = null;
  // savedItems: {
  //   imagePosts: any[],
  //   articlePosts: any[],
  //   shortVideos: any[],
  //   longVideos: any[]
  // } = {
  //   imagePosts: [],
  //   articlePosts: [],
  //   shortVideos: [],
  //   longVideos: []
  // };
 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: AuthService,
    private articleService: ArticleService,
    private userService:UserService,
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
    this.sentRequestUsers = [];
    this.friends=[];
    this.followRequests = [];
    this.followRequests$ = this.userService.followRequests$;
 
  }
  

  getSafeImageUrl(imageData: string | null | undefined): SafeUrl | null {
    if (imageData) {
      return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${imageData}`);
    }
    return null;
  }
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      if (params['section']) {
        this.showSection(params['section']);
      }
      if (params['tab']) {
        this.setActiveTab(params['tab']);
      }
    });
  

  
    this.loadAllPosts()
      this.route.queryParams.subscribe(params => {
        if (params['tab']) {
          this.setActiveTab(params['tab']);
        }
      });
    
      
      this.loadSavedItems(this.userId); // Make sure this.userId is defined

    this.fetchUserDetails();
    // this.userService.fetchUsers();
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
      this.cdr.markForCheck();
    });
    
 
 
    this.fetchSentFollowRequests();
 
    const isLoggedIn = this.authService.isLogged(); // Check if user is logged in
    if (isLoggedIn) {
      this.userId = Number(this.authService.getId()); // Assign user ID if logged in
    }
    
    this.getUserDetails(this.currentUser.id);
    this.userService.fetchUsers();
    this.userService.fetchFollowRequests(Number(this.currentUserId));
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
    this.fetchFollowRequests();
    this.userService.followRequests$.subscribe(requests => {
      console.log('Updated follow requests:', requests);
      // Update your component's state or trigger change detection if necessary
    });
    this.userService.fetchFollowRequests(Number(this.currentUserId)).subscribe();
   
    const currentUserId = this.authService.getId();
    if (currentUserId) {
      this.userService.fetchUsers();
      this.userService.fetchFollowRequests(Number(currentUserId));
      this.userService.updateFollowerCount(Number(currentUserId));
      this.userService.updateFollowingCount(Number(currentUserId));
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
    this.updateShort;
    this.setupPolling();
  
 
  }

  handleImageError(event: any) {
    console.error('Image failed to load:', event.target.src);
    event.target.src = 'assets/default-avatar.png';  // Make sure this file exists in your assets folder
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
  
  setupPolling() {
    setInterval(async () => {
      if (this.activeTab === 'sentRequests') {
        await this.fetchSentFollowRequests();
      } 
      else if (this.activeTab=== 'followrequests')
      {
        await this.fetchFollowRequests();
      }
      // else if(this.activeTab==='friends'){
      //   await this.fetchFollowing();
      // }
      // else if(this.activeTab==='Suggestions'){
      //   await this.userService.fetchUsers();
      // }
       // else if (this.activeTab === 'followers') {
      //   await this.fetchFollowers();
      // }
      this.cdr.markForCheck();
    }, 5000); // Poll every 5 seconds
  }
 
  updateCounts() {
    const userId = this.authService.getId();
    this.userService.updateFollowerCount(Number(userId));
    this.userService.updateFollowingCount(Number(userId));
  }
 
  async fetchSentFollowRequests(): Promise<void> {
    try {
      const sentRequestsWithCounts = await this.userService.getSentFollowRequests().toPromise();
      if (sentRequestsWithCounts) {
        this.sentRequestUsers = sentRequestsWithCounts.map(sentRequest => ({
          id: sentRequest.id,
          name: sentRequest.name,
          profession: sentRequest.profession,
          userImage: sentRequest.userImage,
          followingCount: sentRequest.followingCount,
          isFollowed: false,
          followRequested: true
        }));
      } else {
        this.sentRequestUsers = [];
      }
      console.log('Sent follow requests:', this.sentRequestUsers);
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error fetching sent follow requests:', error);
      this.sentRequestUsers = [];
    }
  }
  async updateSentRequestUsers(): Promise<void> {
    const userPromises = this.sentFollowRequests.map(async userId => {
      const user = await this.userService.getUserById(userId).toPromise();
      const followingCount = await firstValueFrom(this.userService.getFollowingCount(userId));
      return {
        id: user?.id,
        name: user?.name,
        profession: user?.profession,
        userImage: user?.userImage,
        followingCount: followingCount.count
      };
    });
    this.sentRequestUsers = await Promise.all(userPromises);
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
    this.fetchFollowing();
 
  }
 
  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'articles') {
      this.loadArticles();
    } else if (tab === 'photos') {
      this.loadPhotos();
    } else if (tab === 'videos') {
      this.loadVideos();
    } else if (tab === 'shorts') {
      this.loadShorts();
    }
 
    else if (tab === 'friends') {
      console.log('Fetching friends...');
      this.fetchFollowing();
    }
    else if (tab==='followers') {
      console.log("fetching followers");
      this.fetchFollowers();
    }
    else if (tab === 'sentRequests') {
      console.log("fetching sent requests");
      this.fetchSentFollowRequests();
    }
    else if(tab === 'followrequests'){
      this.fetchFollowRequests();
      console.log("fetching sent requetss");
    }
    this.cdr.markForCheck();
   
  }
 
  onFollowingClick() {
    this.setActiveTab('friends');
  }
  onFollowerClick(){
    this.setActiveTab('followers');
  }
  
 
  async followUser(userId: number): Promise<void> {
    try {
      await this.userService.followUser(userId).toPromise();
      console.log('Follow request sent successfully');
      await this.fetchSentFollowRequests();
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error sending follow request', error);
    }
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
        this.transformToPostFormat(articles, 'article')

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
 
  loadUserProfile(): void {
    this.http.get(`${environment.apiBaseUrl}/user/profile/${this.userId}`).subscribe(response => {
      this.user = response;
      this.userService.getFollowerCount(+this.userId).subscribe(
        result => this.followerCount = result.count
      );
      this.userService.getFollowingCount(+this.userId).subscribe(
        result => this.followingCount = result.count
      );
    });
  }
  deleteVideo(id: number) {
    this.videoService.deleteVideo(id).subscribe({
      next: () => {
        console.log('Video deleted successfully');
        this.videos = this.videos.filter(video => video.id !== id);
        this.rearrangedVideos = this.rearrangedVideos.filter(video => video.id !== id);
      },
      error: (error: any) => {
        console.error('Error deleting video', error);
      }
    });
  }
 
  showFullPost(photo: any) {
    this.showFullPosts = true;
    this.rearrangedPhotos = [photo];
  }

  unfollowUser(userId: number) {
    const currentUserId = this.authService.getId();
    if (!currentUserId) {
      console.error('No user is currently logged in');
      return;
    }
 
    this.userService.unfollowUser(Number(currentUserId), userId).subscribe({
      next: () => {
        console.log('Unfollow successful');
        this.updateCounts();
        this.fetchFollowing(); // Refresh the friends list
      },
      error: (error) => {
        console.error('Unfollow failed', error);
      }
    });
  }
 
 
  async acceptFollowRequest(userId: number): Promise<void> {
    try {
      await this.userService.incrementCounts(userId, this.cuserId).toPromise();
      console.log('Follow request accepted');
      this.userService.removeFollowRequestFromList(userId);
      await this.fetchFollowers();
      await this.updateCounts();
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
      await this.fetchSentFollowRequests();
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error cancelling follow request', error);
    }
  }
  
  removeFollower(follower: User) {
    const currentUserId = this.authService.getId();
    if (!currentUserId) {
      console.error('No user is currently logged in');
      return;
    }
  
    this.userService.removeFollower(follower.id, Number(currentUserId)).subscribe({
      next: () => {
        this.userService.removeFollowRequestFromList(follower.id);
        console.log('Follower removed successfully',follower.id);
        this.updateCounts();
        this.fetchFollowing(); // Refresh the friends list
       
      },
      error: (error) => {
        console.error('Remove follower failed', error);
      }
    });
  }


  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      user => {
        this.user = user;
        console.log('User details:', this.user);
        this.fetchFollowerAndFollowingCounts(userId);
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

 openUserProfile(userId:number):void{
  this.router.navigate(['/usersprofile', userId]);
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
 
  addCommentArticle(articleId: number): void {
    const comment = this.newComment.trim();
    if (!comment) {
      return;
    }
    this.articleService.addComment(articleId, comment).subscribe(
      newComment => {
        console.log('Comment added successfully:', newComment); // Debug log
        const article = this.articles.find(a => a.id === articleId);
        if (article) {
          if (!article.comments) {
            article.comments = [];
          }
          article.comments.push(newComment);
          this.newComment = ''; // Clear the textarea after adding comment
          this.articleService.getTotalCommentsByArticlePostId(articleId).subscribe(
            count => article.totalComments = count,
            error => console.error('Error updating total comments count:', error)
          );
        }
      },
      error => {
        console.error('Error adding comment:', error); // Debug error
      }
    );
  }
  //edit /////////
  editItem(item: any, type: 'photo' | 'video' | 'article' | 'short') {
    this.editingItem = {...item};
    this.editingItemType = type;
 
    if (type === 'photo' || type === 'video' || type === 'short') {
      console.log('Item:', item);
     
      if (type === 'photo') {
        this.editingItem.caption = item.caption || item.imageDescription || '';
        console.log('Photo description:', this.editingItem.caption);
      } else if (type === 'video' || type === 'short') {
        this.editingItem.caption = item.caption || item.shortVideoDescription || item.videoDescription || '';
        console.log('Video/Short description:', this.editingItem.caption);
      }
    } else if (type === 'article') {
      this.editingItem.article = item.article || '';
    }
 
    console.log('Final editing item:', this.editingItem);
  }
 
 
 
  updateItem() {
    if (!this.editingItem || !this.editingItemType) return;
 
    switch (this.editingItemType) {
      case 'photo':
        // this.updatePhoto();
        break;
      case 'video':
        this.updateVideo();
        break;
      case 'article':
        // this.updateArticle();
        break;
      case 'short':
        this.updateShort();
        break;
    }
  }
 updateShort() {
  if (!this.editingItem || this.editingItemType !== 'short') return;
 
  const shortDescription = this.editingItem.caption || '';
  this.videoService.updateShortDescription(this.editingItem.id, shortDescription).subscribe({
    next: (response) => {
      this.handleSuccessfulShortUpdate(response, shortDescription);
    },
    error: (error) => {
      if (error.status === 200 || error.status === 0) {
        // Treat 200 error or syntax error (status 0) as success
        console.log('Treating error as success', error);
        this.handleSuccessfulShortUpdate(error, shortDescription);
      } else {
        console.error('Error updating short description', error);
      }
    }
  });
}
 
private handleSuccessfulShortUpdate(response: any, updatedDescription: string) {
  console.log('Short description update treated as successful', response);
   
  // If response is an error object, it might not have a body property
  const updatedShort = response.body || response;
 
  // Ensure we have an id to work with
  const shortId = updatedShort.id || this.editingItem.id;
 
  // Update the short in the shorts array
  const index = this.shorts.findIndex(s => s.id === shortId);
  if (index !== -1) {
    this.shorts[index] = {
      ...this.shorts[index],
      shortVideoDescription: updatedDescription,
      // Add any other properties you want to update here
    };
  }
 
  // Update the short in the rearrangedShorts array
  const rearrangedIndex = this.rearrangedShorts.findIndex(s => s.id === shortId);
  if (rearrangedIndex !== -1) {
    this.rearrangedShorts[rearrangedIndex] = {
      ...this.rearrangedShorts[rearrangedIndex],
      shortVideoDescription: updatedDescription,
      // Add any other properties you want to update here
    };
  }
 
  this.cancelEdit();
  this.cdr.detectChanges();
}
  // updatePhoto() {
  //   if (!this.editingItem || this.editingItemType !== 'photo') return;
 
  //   const imageDescription = this.editingItem.caption || '';
  //   this.imagePostService.updateImagePost(this.editingItem.id, imageDescription).subscribe({
  //     next: (updatedPhoto) => {
  //       console.log('Photo description updated successfully');
  //       const index = this.photos.findIndex(p => p.id === updatedPhoto.id);
  //       if (index !== -1) {
  //         this.photos[index] = {...this.photos[index], ...updatedPhoto};
  //       }
  //       const rearrangedIndex = this.rearrangedPhotos.findIndex(p => p.id === updatedPhoto.id);
  //       if (rearrangedIndex !== -1) {
  //         this.rearrangedPhotos[rearrangedIndex] = {...this.rearrangedPhotos[rearrangedIndex], ...updatedPhoto};
  //       }
  //       this.cancelEdit();
  //       this.cdr.detectChanges();
  //     },
  //     error: (error) => console.error('Error updating photo description', error)
  //   });
  // }
 
  updateVideo() {
    if (!this.editingItem || this.editingItemType !== 'video') return;
 
    const videoDescription = this.editingItem.caption || '';
    this.videoService.updateVideoDescription(this.editingItem.id, videoDescription).subscribe({
      next: (response) => {
        this.handleSuccessfulUpdate(response, videoDescription);
      },
      error: (error) => {
        if (error.status === 200 || error.status === 0) {
          // Treat 200 error or syntax error (status 0) as success
          console.log('Treating error as success', error);
          this.handleSuccessfulUpdate(error, videoDescription);
        } else {
          console.error('Error updating video description', error);
        }
      }
    });
  }
 
  private handleSuccessfulUpdate(response: any, updatedDescription: string) {
    console.log('Video description update treated as successful', response);
   
    // If response is an error object, it might not have a body property
    const updatedVideo = response.body || response;
 
    // Ensure we have an id to work with
    const videoId = updatedVideo.id || this.editingItem.id;
 
    // Update the video in the videos array
    const index = this.videos.findIndex(v => v.id === videoId);
    if (index !== -1) {
      this.videos[index] = {
        ...this.videos[index],
        shortVideoDescription: updatedDescription,
        // Add any other properties you want to update here
      };
    }
 
    // Update the video in the rearrangedVideos array
    const rearrangedIndex = this.rearrangedVideos.findIndex(v => v.id === videoId);
    if (rearrangedIndex !== -1) {
      this.rearrangedVideos[rearrangedIndex] = {
        ...this.rearrangedVideos[rearrangedIndex],
        shortVideoDescription: updatedDescription,
        // Add any other properties you want to update here
      };
    }
 
    this.cancelEdit();
    this.cdr.detectChanges();
  }
  // updateArticle() {
  //   if (!this.editingItem || this.editingItemType !== 'article') return;
 
  //   const articleContent = this.editingItem.article;
 
  //   if (typeof articleContent !== 'string') {
  //     console.error('Article content is not a string:', articleContent);
  //     return;
  //   }
 
  //   this.articleService.updateArticlePost(this.editingItem.id, articleContent).subscribe({
  //     next: (updatedArticle: any) => {
  //       console.log('Article updated successfully', updatedArticle);
  //       const index = this.articles.findIndex(a => a.id === this.editingItem.id);
  //       if (index !== -1) {
  //         this.articles[index] = { ...this.articles[index], article: articleContent };
  //       }
  //       const rearrangedIndex = this.rearrangedArticles.findIndex(a => a.id === this.editingItem.id);
  //       if (rearrangedIndex !== -1) {
  //         this.rearrangedArticles[rearrangedIndex] = { ...this.rearrangedArticles[rearrangedIndex], article: articleContent };
  //       }
  //       this.cancelEdit();
  //       this.cdr.detectChanges();
  //     },
  //     error: (error: any) => {
  //       console.error('Error updating article', error);
  //     }
  //   });
  // }
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
         this.images = this.images;
         this.loadAdditionalPhotoInfo();
         this.cdr.detectChanges();
       },
       
       (error) => {
         console.error('Error loading photos:', error);
       }
     );
   }
   loadAdditionalPhotoInfo() {
     this.images.forEach(images => {
       this.imagePostService.getLikeCount(images.id).subscribe(
         likeCount => images.likeCount = likeCount,
         error => console.error('Error loading like count:', error)
       );
 
       this.imagePostService.  getShareCount(images.id).subscribe(
         shareCount => images.shareCount = shareCount,
         error => console.error('Error loading share count:', error)
       );
     });
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
 
  deleteItem(itemId: number, itemType: 'photo' | 'article' | 'video' | 'short') {
    switch(itemType) {
      case 'photo':
        this.imagePostService.deleteImagePost(itemId).subscribe({
          next: () => {
            console.log('Image post deleted successfully');
            this.images = this.images.filter(imagePost => imagePost.id !== itemId);
            this.rearrangedPhotos = this.rearrangedPhotos.filter(imagePost => imagePost.id !== itemId);
            this.cdr.detectChanges();
          },
          error: (error) => console.error('Error deleting image post', error)
        });
        break;
       case 'article':
      this.articleService.deleteArticle(itemId).subscribe({
        next: () => {
          console.log('Article deleted successfully');
          this.updateArticleArrays(itemId);
        },
        error: (error) => {
          if (error.status === 200) {
            console.log('Article deleted successfully (caught in error block)');
            this.updateArticleArrays(itemId);
          } else {
            console.error('Error deleting article', error);
          }
        }
      });
      break;
 case 'video':
      this.videoService.deleteVideo(itemId).subscribe({
        next: () => {
          console.log('Video deleted successfully');
          this.videos = this.videos.filter(video => video.id !== itemId);
          this.rearrangedVideos = this.rearrangedVideos.filter(video => video.id !== itemId);
          this.cdr.detectChanges();
        },
        error: (error) => {
          if (error.status === 200 || error instanceof SyntaxError) {
            console.log('Video deleted successfully (caught in error block)');
            this.videos = this.videos.filter(video => video.id !== itemId);
            this.rearrangedVideos = this.rearrangedVideos.filter(video => video.id !== itemId);
            this.cdr.detectChanges();
          } else {
            console.error('Error deleting video', error);
          }
        }
      });
      break;
 
    case 'short':
      this.videoService.deleteShort(itemId).subscribe({
        next: () => {
          console.log('Short deleted successfully');
          this.shorts = this.shorts.filter(short => short.id !== itemId);
          this.rearrangedShorts = this.rearrangedShorts.filter(short => short.id !== itemId);
          this.cdr.detectChanges();
        },
        error: (error) => {
          if (error.status === 200 || error instanceof SyntaxError) {
            console.log('Short deleted successfully (caught in error block)');
            this.shorts = this.shorts.filter(short => short.id !== itemId);
            this.rearrangedShorts = this.rearrangedShorts.filter(short => short.id !== itemId);
            this.cdr.detectChanges();
          } else {
            console.error('Error deleting short', error);
          }
        }
      });
      break;
  }
}
 
  private updateArticleArrays(itemId: number) {
    this.articles = this.articles.filter(article => article.id !== itemId);
    this.rearrangedArticles = this.rearrangedArticles.filter(article => article.id !== itemId);
    this.cdr.detectChanges();
  }
 
 //////////////////////saveditems//////
getImageSource(item: any): string {
    console.log('User data:', item.user);
    if (item.user?.userImage) {
      return 'data:image/jpeg;base64,' + item.user.userImage;
    } else {
      console.log('Using default image');
      return '../../assets/image (3).jpg';
    }
  }
 
  onImageError(event: any) {
    console.log('Image failed to load, using default');
    event.target.src = '../../assets/image (3).jpg';
  }
 
 
 loadSavedItems(userId: number) {
  console.log('Loading saved items for user:', userId);
  this.videoService.getAllSavedItems(userId).subscribe(
    (data: any) => {
      console.log('Received saved items data:', data);
      this.savedItems = [
        ...data.imagePosts.map((item: any) => ({ ...item, type: 'image', savedItemId: item.id })),
        ...data.articlePosts.map((item: any) => ({ ...item, type: 'article', savedItemId: item.id })),
        ...data.shortVideos.map((item: any) => ({ ...item, type: 'shortVideo', savedItemId: item.id })),
        ...data.longVideos.map((item: any) => ({ ...item, type: 'longVideo', savedItemId: item.id }))
      ];
      console.log('Processed saved items:', this.savedItems);
    },
    (error) => {
      console.error('Error fetching saved items:', error);
    }
  );
}

// removeSavedItem(savedItemId: number) {
//   console.log('Attempting to remove saved item with ID:', savedItemId);
//   this.videoService.removeSavedItem(savedItemId).subscribe({
//     next: () => {
//       console.log('Item removed successfully');
//       this.savedItems = this.savedItems.filter(item => item.savedItemId !== savedItemId);
//       if (this.rearrangedSavedItems) {
//         this.rearrangedSavedItems = this.rearrangedSavedItems.filter(item => item.savedItemId !== savedItemId);
//       }
//       console.log('Updated saved items:', this.savedItems);
//     },
//     error: (error) => {
//       console.error('Error removing item:', error);
//     }
//   });
// }
showFullSavedItemFrom(index: number) {
  this.rearrangedSavedItems = [
    ...this.savedItems.slice(index),
    ...this.savedItems.slice(0, index)
  ];
  this.showFullSavedItems = true;
}


toggleOptionsd(event: Event) {
  const dropdown = (event.target as HTMLElement).nextElementSibling as HTMLElement;
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  event.stopPropagation();
}
 ///////////saveditems///////
 
  likeImage(postId: number) {
    this.imagePostService.likeImagePost(postId, Number(this.userId)).subscribe(() => {
      this.loadPhotos();
    });
  }
 
  shareImage(postId: number) {
    this.imagePostService.shareImagePost(postId).subscribe(() => {
      this.loadPhotos();
    });
  }
 
  // submitComment(photoId: number) {
  //   const comment = this.newComment.trim();
  //   if (!comment) {
  //     return;
  //   }
  //   this.http.post(`${environment.apiBaseUrl}/imageposts/${photoId}/comment`, { text: comment, userId: this.currentUser.id }).subscribe(
  //     newComment => {
  //       console.log('Comment added successfully:', newComment); // Debug log
  //       const photo = this.images.find(p => p.id === photoId);
  //       if (photo) {
  //         if (!photo.comments) {
  //           photo.comments = [];
  //         }
  //         photo.comments.push(newComment);
  //         this.newComment = ''; // Clear the textarea after adding comment
  //         this.http.get(`${environment.apiBaseUrl}/imageposts/${photoId}/comments/count`).subscribe(
  //           (count: any) => photo.commentsCount = count,
  //           error => console.error('Error updating total comments count:', error)
  //         );
  //       }
  //     },
  //     error => {
  //       console.error('Error adding comment:', error); // Debug error
  //     }
  //   );
  // }
 
  // ==========================================================================================
  //shorts///////////////
 
  loadShorts() {
    this.videoService.getShortsByUserId(this.userId).subscribe(
      shorts => {
        console.log('Fetched short object:', shorts); // Check the structure here
    this.shareShorts(shorts);
        this.shorts = shorts.map(short => ({
          ...short,
          viewCount:short.shortVideoViews,
          profileImage:short.user.userImage,
          likeCount: short.shortVideoLikes || 0,
          shareCount: short.shortVideoShares || 0,
          commentCount: short.videoComments || 0,
          comments: short.videoComments || []
        }));
        this.shorts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());  

        console.log('Shorts loaded:', this.shorts);
      },
      error => {
        console.error('Error loading shorts:', error);
      }
    );
  }
  showFullShortsPostsFrom(index: number) {
    this.showFullShortsPosts = true;
    this.rearrangedShorts = [
      ...this.shorts.slice(index),
      ...this.shorts.slice(0, index)
    ];
  }

 
  
  // videos
  showFullVideoPostsFrom(postId: number) {
    this.showFullVideoPosts = true;
    this.rearrangedVideos = [
      ...this.videos.slice(postId),
      ...this.videos.slice(0, postId)
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
  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.click();
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newImage = this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string);
        this.userImage = this.newImage;
        this.showImagePreview();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

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
      this.fusionService.uploadUserImage(this.userId, file).subscribe({
        next: (response) => {
          console.log('Image uploaded successfully');
          this.fetchUserDetails(); // Refresh the profile image after upload
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse && error.status === 200) {
            // This catches the case where we get a 200 status but a parsing error
            console.log('Image uploaded successfully');
            this.fetchUserDetails(); // Refresh the profile image after upload
          } else {
            console.error('Error uploading image:', error);
            // Handle other types of errors here
          }
        }
      });
    } else {
      console.error('No file selected or user ID not set');
    }
  }
 fetchFollowerAndFollowingCounts(userId:number) {
    const currentUserId=this.authService.getId();
    this.userService.getFollowerCount(userId).subscribe(
      (result) => {
        this.followerCount = result;
        console.log('Updated follower count:', this.followerCount);
      },
      error => console.error('Error fetching follower count:', error)
    );
    this.userService.getFollowingCount(userId).subscribe(
      result => {
        this.followingCount = result;
        console.log('Updated following count:', this.followingCount);
      },
      error => console.error('Error fetching following count:', error)
    );
  }
 
  role:any;
  userDescription:any;
  userImage: SafeUrl | null = null;
  originalImage: SafeUrl | null = null;

  fetchUserDetails(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.fusionService.getUserById(userId).subscribe({
        next: (data) => {
          this.user = data;
          this.userId = data.id;
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
      console.error('User ID not found in local storage');
    }
  }
  navigateToFeed(){
    this.router.navigate(['/feed']);
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
  
  this.videoService.getShortsByUserId(this.userId).subscribe(
    (shorts: any[]) => {
      this.shorts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());  

      this.reorderedShorts = shorts;

      console.log('Fetched shorts data:', this.reorderedShorts);
      this.openComments(postId);
    },
    error => {
      console.error('Error fetching shorts data:', error);
    }
  );
}

addNestedComment(parentCommentId: number, userId: number): void {
  const content = this.replyContent[parentCommentId];
  if (!content || !content.trim()) {
    return;
  }
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
    isEditing:false,
    showMenu:false ,

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
    showMenu:false ,

isEditing:false,
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
   
toggleOptionsMenu(post: any) {
  post.showOptionsMenu = !post.showOptionsMenu;
}
toggleMenu(post: any) {
  post.showMenu = !post.showMenu;
}
isCurrentUserPost(post: any): boolean {  
  return this.user.id === post.userId;  
}  
 
openEditModal(post: any) {  
  this.editingPost = { ...post, editedDescription: post.description };  
}  
 
saveEdit() {
  if (!this.editingPost) return;
 
  const index = this.combinedPosts.findIndex(p => p.id === this.editingPost.id);
  if (index === -1) return;
 
  const originalDescription = this.combinedPosts[index].description;
  const newDescription = this.editingPost.editedDescription;
 
  // Optimistically update the UI
  this.combinedPosts[index].description = newDescription;
  this.combinedPosts[index].isEditing = false;
  setTimeout(() => {
  this.fusionService.updatePost(this.editingPost.id, this.editingPost.type, newDescription)
    .pipe(
      finalize(() => {
        this.editingPost = null;
      })
    )
    .subscribe({
      next: (updatedPost) => {
        // Update with the response from the server
        this.combinedPosts[index] = {
          ...this.combinedPosts[index],
          ...updatedPost
        };
      },
      error: (error) => {
        console.error('Error updating post:', error);
        // Revert changes on error
        this.combinedPosts[index].description = originalDescription;
        // Optionally, show an error message to the user
      }
    });
  }, 3000); // 5-second delay
 
}  
deletePost(post: any) {  
  if (confirm('Are you sure you want to delete this post?')) {  
    this.fusionService.deletePost(post.id, post.type)  
      .subscribe(  
        () => {  
          this.combinedPosts = this.combinedPosts.filter(p => p.id !== post.id);  
          this.cdr.detectChanges(); // Ensure change detection after deleting  
        },  
        (error) => {  
          console.error('Error deleting post:', error);  
        }  
      );  
  }  
}  
cancelEdit() {  
  this.editingPost = null;  
}  
trackByPostId(index: number, post: any): number {  
  return post.id; // Assuming post.id is unique  
} 


}