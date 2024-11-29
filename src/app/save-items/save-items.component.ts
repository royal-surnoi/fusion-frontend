import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, map, catchError, of } from 'rxjs';
import { FusionService } from '../fusion.service';
import { Router } from '@angular/router';
declare var bootstrap: any; // Declare bootstrap variable to avoid TypeScript errors
 
export interface Video{
  id: number;
  src: string;
  likes: number;
  comments: string[];
  shortVideoLikes: number;
  shortVideoShares: number;
  shortVideoViews: number;
  description?:string;
}




 interface Post {
  type: 'video' | 'article' | 'image';
  id: number;
  title: string;
  src: string;
  likes: number;
  comments: string[];
  share?: number;
  Shares: number;
  content: string;
  timestamp: any;
  profileImage: string;
  profileName: string;
  isVideo?: boolean;
  isArticle?: boolean;
  isImage?: boolean;
  showComments?: boolean;
  liked?: boolean;
  showShareMenu?: boolean;
  saved?: boolean;
  newComment?: string;
  showShareOptions?: boolean;
  showCommentBox?: boolean;
  showShareModal?: boolean;
  showFullContent?: boolean;
  videoComments: string[] | null;
  shortVideoLikes: number;
  shortVideoShares: number;
  shortVideoViews: number;
  shareCount: number;
  description:string;
}

export interface Video {
  title: string;
  src: string;
  likes: number;
  comments: string[];
  showComments?: boolean;
  liked?: boolean;
  showShareMenu?: boolean;
  saved?: boolean;
  profileImage: string;
  profileName: string;
  isArticle?: boolean;
  share: number;
  Shares: number;
  content: string;
  newComment?: string;
  showShareOptions?: boolean;
  showCommentBox?: boolean;
  showShareModal?: boolean;
  timestamp: any;
  showFullContent?: boolean;
  isImage?: boolean;
  id: number;
  videoComments: string[] | null;
  shortVideoLikes: number;
  shortVideoShares: number;
  shortVideoViews: number;
  shareCount: number;
}
 

@Component({
  selector: 'app-save-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule,HttpClientModule],
  templateUrl: './save-items.component.html',
  styleUrl: './save-items.component.css'
})
export class SaveItemsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('liveVideo') liveVideo!: ElementRef;
  @ViewChild('photoCanvas') photoCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('shortVideoInput') shortVideoInput!: ElementRef<HTMLInputElement>;
  post = { title: '', content: '', likes: 0, comments: [], liked: false };
  
  posts: Post[] = []; // Use the Post interface/type for posts array
  newComment: string = '';

  selectedPostIndex: number | null = null; // Track the selected post index for sharing modal
  
  images: Post[] = [];
  articles: Post[] = [];
  combinedPosts: Post[] = [];
  videos: Post[] = [];
  shorts: Post[] = [];
  suggestedConnections = [
    {name:''}
  ]
 
 
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
  videoCommentContent:any;
  getarticllike: any;
  getartcilebyid: any;
  articlLike: any;
  articleShare: any;
  vedioLike: any;
  videoId:number=1;
  currentPost: any;
 
  formatDate(dateString: string): string {
    return formatDate(dateString, 'mediumDate', 'en-US');
  }
 
  engageSuggestions = [
    ' Join the "Tech Innovators" group',
    'Participate in the "Hackathon 2024"',
    ' Attend the "Networking Night"',
    ' Follow the "AI Trends" page'
  ];
  
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
  currentUserId: number = 1; // Replace with the actual user ID
  commentCount: number = 0; // Variable to hold comment count
 
 
   user: any;
     errorMessage: string = ''
 
  newPost: any = { content: '', image: null, video: null };
  userId:number=0;
  constructor(private http: HttpClient, private cdRef:ChangeDetectorRef,private fusionService:FusionService, private sanitizer: DomSanitizer,private router:Router ){
 
  }
  ngOnInit(): void {
    this.getShorts();

    this.posts = []
    this.getVideos()
    this.getArticles();
    this.fetchUserDetails();
    this.cdRef.detectChanges();

    // this.visibleShorts = this.shorts.slice(0, this.shortsBatchSize);
    this.currentVideoSrc = this.videos[0].src;
    this.getVideoLike(this.videoId)
    this.fetchCommentCount(this.videoId)
    // console.log(this.returnArticalComments(1))
    // this.getCommentsOfArtical()
    this.getCommentsAtIndex(1)
 console.log("comments",this.returnArticalComments(2))
 this.returnArticalComments(1).subscribe(
  comments => console.log('Comments:', comments),
  error => console.error('Error:', error)
);
}
 
 
fetchUserDetails(): void {
  const userId = localStorage.getItem('id');
  if (userId) {
    this.fusionService.getUserById(userId).subscribe({
      next: (data) => {
        this.user = data;
        this.userId = data.id; // Set userId based on fetched user data
        // Optionally set other user-related properties here if needed
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
    });
  } else {
    console.error('User ID not found in local storage');
  }
}



triggerShortVideoUpload() {
  this.shortVideoInput.nativeElement.click();
}
 
// uploadShortVideo(event: any) {
//   const file = event.target.files[0];
//   if (file && file.type.startsWith('video/')) {
//     console.log('Uploading short video:', file.name);
//     this.fusionService.uploadShortVideo(this.userId, file).subscribe(
//       response => {
//         console.log('Short video uploaded successfully', response);
//         // Transform the response to your Video format
//         const newShortVideo = this.transformToVideoFormat(response, 'video');
//         // Add the new short video to your shorts array
//         this.shorts.unshift(newShortVideo);
//         // Optionally, you might want to update your visibleShorts array as well
//         this.visibleShorts = this.shorts.slice(0, this.initialVisibleShorts);
//       },
//       error => {
//         console.error('Error uploading short video', error);
//         // Handle error (e.g., show an error message)
//       }
//     );
//   } else {
//     console.error('Invalid file type. Please select a video file.');
//   }
// }
uploadShortVideo(event: any, description: string): void {
  const input = event.target as HTMLInputElement;
 
  if (!input.files?.length) {
    this.errorMessage = 'No file selected';
    return;
  }
 
  const file = input.files[0];
 
  if (file && file.type.startsWith('video/')) {
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
        this.fusionService.uploadShortVideo(this.userId, file, description).subscribe(
          response => {
            console.log('Short video uploaded successfully', response);
            const newShortVideo = this.transformToVideoFormat(response, 'video');
            this.shorts.unshift(newShortVideo);
            // this.visibleShorts = this.shorts.slice(0, this.initialVisibleShorts);
          },
          error => {
            if (error.status !== 200) {
              console.error('Error uploading short video', error);
              this.errorMessage = 'Error uploading short video. Please try again.';
            } else {
              // If status is 200, treat it as a success
              console.log('Short video uploaded successfully');
              const newShortVideo = this.transformToVideoFormat(error.error, 'video');
              this.shorts.unshift(newShortVideo);
              // this.visibleShorts = this.shorts.slice(0, this.initialVisibleShorts);
            }
          }
        );
      } else {
        this.errorMessage = 'Video does not meet the criteria for shorts. Please ensure your video is no longer than 120 seconds and has a maximum resolution of 1080x1920.';
      }
    };
 
    videoElement.onerror = () => {
      this.errorMessage = 'Error loading video metadata. Please try again with a different video.';
    };
  } else {
    this.errorMessage = 'Invalid file type. Please select a video file.';
  }
}


getShorts(): void {
  this.fusionService.getShortVideos()
    .subscribe(
      (response: any[]) => {
        this.shorts = response; // Assuming your API returns an array of shorts
      },
      (error) => {
        console.error('Error fetching shorts:', error);
      }
    );

}




transformToVideoFormat(item: any, type: 'video' | 'image' | 'article'): Post {
  const createImageSrc = (imageData: string): string => {
    if (imageData.startsWith('data:image')) {
      return imageData;
    } else if (imageData.startsWith('http') || imageData.startsWith('https')) {
      return imageData;
    } else {
      // Assume it's a base64 string without the data URL prefix
      return `data:image/jpeg;base64,${imageData}`;
    }
  };
  return {
    id: item.id,
    type,
    description:'',
    title: item.title || '',
    isVideo: type === 'video',
    isImage: type === 'image',
    isArticle: type === 'article',
    src: type === 'image' ? createImageSrc(item.imageUrl) : (type === 'video' ? item.s3Url : ''),
    likes: type === 'article' ? item.articleLikeCount : (type === 'image' ? item.imageLikeCount : (type === 'video' ? item.shortVideoLikes : 0)),
    share: type === 'article' ? item.articleShareCount : (type === 'image' ? item.imageShareCount : (type === 'video' ? item.shortVideoShares : 0)),
    timestamp: item.createdAt,
    comments: item.comments || [],
    Shares: 0,
    showComments: false,
    liked: false,
    showShareMenu: false,
    saved: false,
    profileImage: '',
    profileName: item.user?.name || 'Unknown User',
    content: type === 'article' ? item.article : (type === 'image' ? item.imageDescription : item.shortVideoDescription),
    showFullContent: false,
    showShareModal: false,
    videoComments: item.videoComments,
    shortVideoLikes: item.shortVideoLikes,
    shortVideoShares: item.shortVideoShares,
    shortVideoViews: item.shortVideoViews,
    shareCount: item.shortVideoShares
  };
}















 
  addPost() {
    if (this.newPost.content || this.newPost.image || this.newPost.video || this.newPost.article) {
      const fileInput: HTMLInputElement = this.fileInput.nativeElement;

      if (this.newPost.image && this.newPost.image.startsWith('data:image')) {
        this.handleCapturedImage(this.newPost.image);
      } else if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        if (file.type.startsWith('image/')) {
          this.uploadImage(file);
        } else if (file.type.startsWith('video/')) {
          this.uploadLongVideo(file);
        } else if (this.isArticleMode) {
          this.postArticle();
        }
      } else {
        this.handleCapturedImage(this.newPost.content);
      }

      this.newPost = { content: '', image: null, video: null };
    }
  }
  toggleComments(postId: number): void {
    const post = this.combinedPosts.find(post => post.id === postId);
    if (post) {
      post.showComments = !post.showComments;
    } else {
      console.error('Post not found');
    }
    
  }

  addComment(postId: number): void {
    const post = this.combinedPosts.find(post => post.id === postId);
    if (post && this.newComment.trim()) {
      const userId = 0; // Replace with actual userId logic
      this.fusionService.reactToPost(post.type, 'comment', post.id, userId, this.newComment).subscribe(
        () => {
          if (!post.comments) {
            post.comments = [];
          }
          post.comments.push(this.newComment);
          this.newComment = ''; // Clear the newComment field after posting
        },
        (error) => {
          console.error('Error adding comment:', error);
          // Handle error if needed
        }
      );
    }
  }
  
  likePost( userId:number): void {
    this.userId = this.data.id
    const post = this.posts[userId];
    if (post) {
      if (!this.userId) {
        console.error('User ID is not available.');
        return;
      }
      this.userId = this.data.id
      this.fusionService.reactToPost(post.type, 'like', post.id, this.userId).subscribe(() => {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
      });
    }
  }
  
  sharePost(postId: number): void {
    const post = this.posts[postId];
    if (post) {
      this.fusionService.reactToPost(post.type, 'share', post.id).subscribe(() => {
        // Assuming 'share' property exists on Post
        post.share = post.share ? post.share + 1 : 1;
      });
    }
  }
 
  
 

  

  reactToPost(type: 'video' | 'article' | 'image', action: 'like' | 'dislike' | 'share' | 'view' | 'comment', postId: number, userId?: number, content?: string): void {
    this.fusionService.reactToPost(type, action, postId, userId, content).subscribe(response => {
      // Handle response if needed
    });
  }
  


  




 
 
 
ngAfterViewInit(): void {}

getVideos(): void {
  this.fusionService.getAllLongVideos().subscribe(
    (data) => {
      const newVideos = data.map(video => this.transformToVideoFormat(video, 'video'));
      this.videos = [...this.videos, ...newVideos];
      this.updateCombinedPosts();
    },
    (error) => console.error('Error fetching videos:', error)
  );
}

getImages(): void {
  this.fusionService.getAllImagePosts().subscribe(
    (data) => {
      const newImages = data.map(image => {
        console.log('Raw image data:', image); // For debugging
        return this.transformToVideoFormat(image, 'image');
      });
      this.images = [...this.images, ...newImages];
      this.updateCombinedPosts();
    },
    (error) => console.error('Error fetching images:', error)
  );
}
handleImageError(event: any) {
  event.target.src = 'path/to/fallback/image.jpg'; // Replace with a path to a default image
  console.error('Image failed to load:', event.target.src);
}

getArticles(): void {
  this.fusionService.getAllArticlePosts().subscribe(
    (data) => {
      const newArticles = data.map(article => this.transformToVideoFormat(article, 'article'));
      this.articles = [...this.articles, ...newArticles];
      this.updateCombinedPosts();
    },
    (error) => console.error('Error fetching articles:', error)
  );
}

updateCombinedPosts(): void {
  this.combinedPosts = [...this.videos, ...this.images, ...this.articles];
}


  handleCapturedImage(dataUrl: string) {
    // Convert data URL to File object
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
        this.uploadImage(file);
      })
      .catch(error => console.error('Error processing captured image:', error));
  }
 
  uploadImage(file: File) {
    // this.fusionService.createImagePost(this.userId, file).subscribe(
    //   response => {
    //     console.log('Image post created successfully', response);
    //     // Handle successful post creation
    //   },
    //   error => {
    //     console.error('Error creating image post', error);
    //     // Handle error
    //   }
    // );
  }
 
  clearForm() {
    this.newPost = { content: '', image: null, video: null, article: null };
    this.isArticleMode = false;
    this.showMediaOptions = false;
    this.capturedImage = null; // Clear captured image
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
 
  cancelMedia() {
    this.newPost.image = null;
    this.newPost.video = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
 
postArticle() {
    this.fusionService.createArticlePost(this.userId, this.newPost.article).subscribe(
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
  toggleArticleMode() {
    this.isArticleMode = !this.isArticleMode;
    if (this.isArticleMode) {
      this.newPost.article = ''; // Initialize empty article content
    } else {
      this.newPost.article = null; // Clear article content if mode is toggled off
    }
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
 
  // uploadImage(file: File): void {
  //   this.fusionService.createImagePost(this.userId, file).subscribe(
  //     response => {
  //       console.log('Image post created successfully', response);
  //       // Handle successful post creation
  //     },
  //     error => {
  //       console.error('Error creating image post', error);
  //       // Handle error
  //     }
  //   );
  // }
 
  uploadLongVideo(file: File): void {
    // this.fusionService.uploadLongVideo(this.userId, file).subscribe(
    //   response => {
    //     console.log('Video uploaded successfully', response);
    //     // Handle successful video upload
    //   },
    //   error => {
    //     console.error('Error uploading video', error);
    //     // Handle error
    //   }
    // );
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (file.type.startsWith('image/')) {
          this.newPost.image = e.target.result;
          this.newPost.video = null;
        } else if (file.type.startsWith('video/')) {
          this.newPost.video = e.target.result;
          this.newPost.image = null;
        }
      };
      reader.readAsDataURL(file);
    }
  }
 
  
 
  playVideo(video: HTMLVideoElement): void {
    video.play();
  }
 
  onVideoPlays(event: Event) {
    const video = event.target as HTMLVideoElement;
    video.play();
  }
 
  pauseVideo(video: HTMLVideoElement): void {
    video.pause();
  }
 
  onVideoPause(event: Event) {
    const video = event.target as HTMLVideoElement;
    video.pause();
  }
 
  openVideo(index: number): void {
    this.currentVideoIndex = index;
    this.currentVideoSrc = this.videos[this.currentVideoIndex].src;
    const overlay = document.getElementById('videoOverlay') as HTMLElement;
    overlay.style.display = 'flex';
    const overlayVideo = document.getElementById('overlayVideo') as HTMLVideoElement;
    overlayVideo.load();
    overlayVideo.play();
  }
 
 
 


  getComments(videoId: number, index: number): void {
    // this.fusionService.getComments(videoId).subscribe(
    //   (comments: any[]) => {
    //     this.videos[index].comments = comments;
    //     this.videos[index].showComments = true;
    //   },
    //   (error: any) => {
    //     console.error('Error fetching comments:', error);
    //   }
    // );
  }
 
 
  
  getVideoLike(videoId: number){
    this.fusionService.getVideo(videoId).subscribe((res)=>{
      console.log("like",res)
      this.vedioLike = res
    })
  }
 
 
  fetchCommentCount(videoId: number): void {
    this.fusionService.getCommentCount(videoId).subscribe(
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
 
  openShareModal(post: any): void {
    // Assign the current post to display in the modal
    this.currentPost = post;
  }


  // Method to share via different platforms
  shareVia(platform: string, postId: number): void {
    // Ensure currentPost is defined and matches postId (if needed)
  
    const post = this.currentPost;
    if (!post) {
      console.error('Post not found');
      return;
    }
  
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(post.src)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Check out this post&body=${encodeURIComponent(post.src)}`);
        break;
      case 'message':
        window.open(`sms:?body=${encodeURIComponent(post.src)}`);
        break;
      default:
        console.error('Unsupported platform');
        return;
    }
  
    // Assuming this is where you want to handle sharing through a service
    this.fusionService.reactToPost(post.type, 'share', postId).subscribe(
      (res) => {
        console.log('Post shared successfully', res);
        // Example: Increment share count after successful share
        post.shareCount = (post.shareCount || 0) + 1;
      },
      (error) => {
        console.error('Error sharing post', error);
        // Handle error if needed
      }
    );
  }


  shareVia1(platform: string, index: number | null,articleID:any) {
    if (index === null) {
      console.error('Invalid video index');
      return;
    }
    const video = this.videos[index];
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(video.src)}`);
        break;
      case 'message':
        window.open(`sms:?body=${encodeURIComponent(video.src)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Check out this video&body=${encodeURIComponent(video.src)}`);
        break;
    }
    this.fusionService.shareShortVideo(video.id).subscribe(
      (res) => {
        console.log('Video shared successfully', res);
        // Handle success if needed
      },
      (error) => {
        console.error('Error sharing video', error);
        // Handle error if needed
      }
    );
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
 
  startCamera() {
    this.showCamera = true;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.mediaStream = stream;
        this.liveVideo.nativeElement.srcObject = stream;
      })
      .catch(error => console.error('Error accessing camera:', error));
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
      this.stopCamera();
      this.showMediaOptions = false; // Close the media options
      console.log('Photo captured and set to newPost.image');
    }
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
 
  postCapturedPhoto() {
    if (this.capturedImage) {
      // No need to set newPost.image here as it's already set in handleCapturedPhoto
      this.capturedImage = null;
      this.showMediaOptions = false;
      this.addPost();  // This line will immediately post the captured photo
    }
  }
  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    this.showCamera = false;
  }
 
 
  
 
 
likeShort(short: any) {
    short.likes++;
    console.log('Liked!', short);
  }
 onThumbsDownClick(): void {
    alert('this video dislike!');
    // Add more functionality here
  }
 shareShort(short: { src: string }) {
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
 
//  handleKeyPress(event: KeyboardEvent) {
//     if (event.key === 'Enter') {
//       this.submittedComment = this.commentText;
//       this.commentText = '';
//     }
//   }
toggleCommentBox() {
  this.isCommentBoxVisible = !this.isCommentBoxVisible;
}
  addComment1() {
    if (this.commentText.trim()) {
      this.submittedComments.push(this.commentText.trim()); // Push new comment to array
      this.commentText = ''; // Clear the textarea after adding comment
    }
 
  }
 
  // ----------------
  postLikeArticle(articleId:any){
    this.fusionService.postBYid(articleId).subscribe((res)=>{
      console.log(res)
    })
  }
  image(toolImage:any){
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${toolImage}`);
  }  
  // ----------- getartcialcomments----------
  getCommentsOfArtical(articalId:any){
    this.fusionService.getArticalCommentsByArtcialId(articalId).subscribe((res)=>{
      console.log("comments",res)
      this.articalComment = res;
      this.articalCommentCount = this.articalComment.length;
    })
  }
  returnArticalComments(articalId: any): Observable<any> {
    return this.fusionService.getArticalCommentsByArtcialId(articalId).pipe(
      map(res => res), // This ensures we're returning the response data
      catchError(error => {
        console.error('Error fetching comments:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }
  // returnArticalComments(articalId: any): Observable<any> {
  //   return this.fusionService.getArticalCommentsByArtcialId(articalId);
  // }
  postimageLike(articalId:any){
   this.fusionService.postImageLike(articalId).subscribe((res)=>{
      console.log("imagelike",res)
   })
  }
  postImageShare(articalId:any){
    this.fusionService.postImageShare(articalId).subscribe((res)=>{
      console.log("imagelike",res)
    })
  }
  getCommentsAtIndex(iarticalId:any){
    this.fusionService.getCommentsImage(iarticalId).subscribe((res)=>{
      console.log("commentsImage",res)
    })
  }
  postarticlarguments(articalId:any,comment:any){
    this.fusionService.postArtcleComment(articalId,comment).subscribe((res)=>{
      console.log("arguments",res)
    })
  }
   postimagecomponent(articalId:any,comment:any){
    this.fusionService.postImageComment(articalId,comment).subscribe((res)=>{
      console.log("arguments",res)
    })
   }
   getCommentsOfImage(articalId:any){
    this.fusionService.getCommentsImage(articalId).subscribe((res)=>{
      console.log("comments",res)
      this.imageComment = res;
      this.articalCommentCount = this.articalComment.length;
    })
  }
 
  // fetchCommentCount(videoId: number): void {
  //   this.fusionService.getCommentCount(videoId).subscribe(
  //     (count: number) => {
  //       this.commentCount = count;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching comment count:', error);
  //     }
  //   );
  // }
  navigateToSAvedItems(){
    this.router.navigate(['/saveitems'])
  }
    navigateToHomePage(){
      this.router.navigate(['/homepage'])
    }
}
