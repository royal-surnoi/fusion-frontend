 
import { Injectable } from '@angular/core';
import { catchError, of, Observable, map, throwError, BehaviorSubject, tap, forkJoin, shareReplay } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Video1234 } from './fusion2.service';
import { ProfileComponent } from './profile/profile.component';
// import { Lesson, } from './coursecontent/coursecontent.component';
export interface Video234 {
  id: number;
  title: string;
  url: string;
  description?: string;
  videoTitle:string;
  videoDescription:string;
  s3Url:string;
}


interface LessonWithUploadss {
  lessonId: number;
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: string;
  uploadSets: UploadSet[];
}

export interface CourseVideoTrailer {
  id: number;
  videoTrailerTitle: string;  // Change this from 'any' to 'string'
  s3Key: string;              // Change this from 'any' to 'string'
  s3Url: string;              // Change this from 'any' to 'string'
  videoTrailerDescription: string; // Change this from 'any' to 'string'
}


export interface video {
  title: string;
  id: number;
  name: string;
  description: string;


  s3Url: string;
}
export interface Comment {
  content: string;
  parentCommentId: number;
 
  videoCommentContent: string;
  user: {
    id: number;
    name: string;
    email: string;
    // Other properties as needed
  };
  createdAt: Date;
  // Other properties as needed
 
 
}
 
 
export interface Video {
  id: number;
  courseId: number;
  fileName: string;
  fileUrl: string;
 
  // Add other relevant fields here
}
interface Course {
  courseFee: number;
  discountPercentage: number;
  currency: string;
  promoCodeExpiration: string;
  promoCode: string;
}
export interface Lesson {
  id: number;
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  // Ensure to include all other required properties from your API response
}
export interface Lesson1 {
  id: any;
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  // Add any other properties your Lesson type should have
}
 
interface Contact {
  id: number;
  name: string;
}
 
export interface Project12 {
  id?: number;

  projectTitle: string;
  projectDescription: string;
  projectDeadline: any;
  projectDocumentName?: string;
  projectDocument: any;
  
}
 
interface Project {
  id?: number;
  title: string;
  description: string;
  deadline: string;
  document: File;
}
export interface Enrollment {
  id: number;
  courseId: number;
  enrollmentDate: string; // Adjust type as needed based on backend response
  progress: number;
}
 
 
 
 
 
interface Lesson2 {
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  videos?: Video234[]; // Add the videos array to store video data

}
export interface Quiz {
  id?: number;
  quizName: any;
  startDate: any;
  endDate: any;
  // Add other properties as needed
}

export interface CourseDocuments {
  id: any;
  courseId: number;
  courseDocument: any; // or any appropriate type based on your backend
  // Add other relevant fields if needed
}


/////////////update course

interface Lesson2 {
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
}
// interface LessonWithUploads extends Lesson3 {
//   uploadSets: UploadSet[];
// }

interface LessonWithUploads extends Lesson3 {
  uploadSets: UploadSet[];
  videos?: Video234[];
// Add the videos property here
  isVideosFetched?: boolean; // New property to track if videos were fetched
}
interface UploadSet {
  videoFiles: File[];
  videoDescriptions: string[];
}
interface Lesson3 {
  lessonId?: number; // Add lessonId here
 
 
  lessonTitle: string;
  lessonContent: string;
  lessonDescription: string;
  lessonDuration: number;
  // uploadSets: UploadSet[];
 
}
export interface Module {
  name: string;
  lessons: LessonWithUploads[];
}

/////////////////////
export interface BackendQuestion {
  id?: number;
  text: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  userAnswer?: string;
}

export interface DashboardOverview {
  // Define the properties based on the response from your API
  // For example:
  totalCourses: number;
  totalStudents: number;
  upcomingEvents: any[];
  // Add other fields as necessary
}
export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string; // Adjust the type according to your data
  // Add other fields as necessary
  length:any
  assignmentTitle: string;
  assignmentTopicName: string;
  startDate: Date;
  endDate: Date;
  reviewMeetDate: Date;
  assignmentDescription?: string;
  maxScore?: number;
}

// src/app/models/custom-notification.model.ts
export interface CustomNotification {
  id: number;
  message: string;
  date: string;
  // Add other fields as necessary
  content:any;
  timestamp:any;
name:any;
}

export interface Student {
courseTitles: any;
user: any;
  id: number;
  name: string;
  email: string;
  course:any;
  // Add other properties as needed
}
export interface Question {
  // text: string;
  type: string;
  options: Option[];
 
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  text: string;
  correctAnswer: string;
}
 
export interface Option {
  label: string;
  text: string;
}
export interface QuizDetail {
  quizName: string;
  startDate: Date;
  endDate: Date;
  questions: Question[];
  courseName: string;
  courseId: number;
  // quizId: number;
  // quizName: string;
  studentNames: StudentName[];
  studentIds: string | null;
  quizId: number;
}
export interface StudentName {
  studentId: number;
  studentName: string;
}

@Injectable({
  providedIn: 'root'
})
export class FusionService {
  private feedCache$: Observable<any[]> | undefined; // Initialize as undefined

  uploadAssignment2(lessonId: any, courseId: any, assignmentTitle: string, assignmentTopicName: string, selectedFile: File, start: string, end: string, reviewDate: string) {
    throw new Error('Method not implemented.');

}
  private posts: any[] = [];
  private postsSubject = new BehaviorSubject<any[]>([]);
  posts$ = this.postsSubject.asObservable();
 
 
  private apiBaseUrl = environment.apiBaseUrl;
  handleError: any;
 
  constructor(private http: HttpClient) { }
  reactToPost(type: 'video' | 'article' | 'image', action: 'like' | 'dislike' | 'share' | 'view' | 'comment' | 'save', postId: number, userId?: number, content?: string, comment?: string, text?: string, parentCommentId?: number): Observable<any> {
    // Check for userId at the beginning of the method
    if (!userId) {
      const storedUserId = localStorage.getItem('id');
      if (storedUserId) {
        userId = parseInt(storedUserId, 10);
      } else {
        return new Observable(observer => {
          observer.error('User ID not available');
          observer.complete();
        });
      }
    }
 
    let url = '';
 
    switch (action) {
      case 'like':
        url = this.getLikeApiUrl(type, postId, userId);
        break;
      case 'share':
        url = this.getShareApiUrl(type, postId);
        break;
      case 'comment':
        // Use the appropriate parameter based on the post type
        const commentContent = type === 'video' ? content : (type === 'article' ? text : comment);
        url = this.getCommentApiUrl(type, postId, userId, commentContent);
        break;
        case 'save':
      url = this.getSaveApiUrl(type, postId, userId);
      break;
      default:
        return new Observable(observer => {
          observer.error('Unsupported action');
          observer.complete();
        });
    }
 
    console.log('API URL:', url);
 
    // Proceed with the HTTP request
    if (action === 'like' || action === 'save') {
      return this.http.post<void>(url, { userId });
    } else if (action === 'share') {
      return this.http.post<void>(url, {});
    } else if (action === 'comment') {
      return this.http.post<void>(url, {});
    }
 
    // Add a default return statement
    return new Observable(observer => {
      observer.error('Unexpected error occurred');
      observer.complete();
    });
  }
  private getSaveApiUrl(type: 'video' | 'article' | 'image', postId: number, userId?: number): string {
    switch (type) {
        case 'video':
            return `${this.apiBaseUrl}/savedItems/saveShortVideo?userId=${userId}&shortVideoId=${postId}`;
        case 'article':
            return `${this.apiBaseUrl}/savedItems/saveArticlePost?userId=${userId}&articlePostId=${postId}`;
        case 'image':
            return `${this.apiBaseUrl}/savedItems/saveImagePost?userId=${userId}&imagePostId=${postId}`;
        default:
            throw new Error(`Unsupported type: ${type}`);
    }
}
  private getLikeApiUrl(type: 'video' | 'article' | 'image', postId: number, userId?: number, comment?: string
  ): string {
    switch (type) {
      case 'video': return `${this.apiBaseUrl}/long-video/${postId}/like?userId=${userId}`;
      case 'article':
        return `${this.apiBaseUrl}/api/articleposts/${postId}/like?userId=${userId}`;
      case 'image': return `${this.apiBaseUrl}/api/imagePosts/${postId}/like?userId=${userId}`;
      default: return '';
    }
  }
 
 
  private getShareApiUrl(type: 'video' | 'article' | 'image', postId: number): string {
    switch (type) {
      case 'video': return `${this.apiBaseUrl}/long-video/${postId}/share`;
      case 'article': return `${this.apiBaseUrl}/api/articleposts/${postId}/share`;
      case 'image': return `${this.apiBaseUrl}/api/imagePosts/${postId}/share`;
      default: return '';
    }
  }
 
  private getCommentApiUrl(type: 'video' | 'article' | 'image', postId: number, userId?: number, commentContent?: string): string {
    const encodedComment = commentContent ? encodeURIComponent(commentContent) : '';
 
    switch (type) {
      case 'video':
        return `${this.apiBaseUrl}/long-video/${postId}/comment/${userId}?content=${encodedComment}`;
      case 'article':
        return `${this.apiBaseUrl}/api/comments/articlepost/${postId}/add?userId=${userId}&text=${encodedComment}`;
      case 'image':
        return `${this.apiBaseUrl}/api/comments/imagepost/${postId}/add?userId=${userId}&text=${encodedComment}`;
      default:
        return '';
    }
  }
  getReplies(postType: 'video' | 'article' | 'image', commentId: number,postId:number): Observable<Comment[]> {
    let url = '';
    switch (postType) {
      case 'video':
        url = `${this.apiBaseUrl}/long-video/comment/${commentId}/nested`;
        break;
      case 'article':
        url = `${this.apiBaseUrl}/api/comments/parent-comment/${commentId}/nested`;
        break;
      case 'image':
        url = `${this.apiBaseUrl}/api/comments/parent-comment/${commentId}/nested`;
        break;
    }
    return this.http.get<Comment[]>(url);
  }
 
  getCommentss(postType: 'video' | 'article' | 'image', postId: number): Observable<Comment[]> {
    let url = '';
    switch (postType) {
      case 'video':
        url = `${this.apiBaseUrl}/long-video/${postId}/comments`;
        break;
      case 'article':
        url = `${this.apiBaseUrl}/api/comments/articlepost/${postId}`;
        break;
      case 'image':
        url = `${this.apiBaseUrl}/api/comments/imagepost/${postId}`;
        break;
    }
    return this.http.get<Comment[]>(url);
  }
 
 
  addReplyToComment(postType: 'video' | 'article' | 'image', postId: number, userId: number, content: string,parentCommentId: number,commentContent:string
): Observable<Comment> {
  const encodedComment = commentContent ? encodeURIComponent(commentContent) : '';

    let url: string;
    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('text', content);
 
    switch (postType) {
      case 'video':
        url = `${this.apiBaseUrl}/long-video/${postId}/comment/${userId}/nested/${parentCommentId}`;
        params = params
          .set('content', content)
          .set('parentCommentId', parentCommentId.toString());
        break;
      case 'article':
      case 'image':
        url = `${this.apiBaseUrl}/api/comments/add/${userId}/${parentCommentId}/nested?content=${encodeURIComponent(content || '')}`;
        params = params
          .set('postType', postType)
          .set('postId', postId.toString());
        break;
      default:
        throw new Error('Invalid post type');
    }
 
    return this.http.post<Comment>(url, null, { params });
  }
 
  likeComment(
    postType: 'video' | 'article' | 'image',
    postId: number,
    commentId: number,
    userId: number
  ): Observable<any> {
    let url = '';
  
    switch (postType) {
      case 'article':
        url = `${this.apiBaseUrl}/api/comments/comment/${commentId}/${userId}/like`;
        break;
      case 'video':
        url = `${this.apiBaseUrl}/long-video/${postId}/comment/${commentId}/like/${userId}`;
        break;
    
      case 'image':
        url = `${this.apiBaseUrl}/api/comments/comment/${commentId}/${userId}/like`;
        break;
      default:
        throw new Error('Invalid post type');
    }
  
    return this.http.post(url, {});
  }
  
  
 
  likeReply(
    postType: 'video' | 'article' | 'image',
    postId: number,
    commentId: number,
    replyId: number,
    userId: number
  ): Observable<any> {
    let url = '';
  
    switch (postType) {
      case 'video':
        url = `${this.apiBaseUrl}/long-video/nested-comment/${replyId}/like/${userId}`;
        break;
      case 'article':
        url = `${this.apiBaseUrl}/api/comments/${replyId}/${userId}/toggle-like`;
        break;
      case 'image':
        url = `${this.apiBaseUrl}/api/comments/${replyId}/${userId}/toggle-like`;
        break;
      default:
        throw new Error('Invalid post type');
    }
  
    return this.http.post(url, {});
  }
  
 
  incrementViewCount(postId: number): Observable<void> {
    const url = `${this.apiBaseUrl}/long-video/${postId}/view`;
    return this.http.post<void>(url, {});
  }
 
  incrementViewCount2(postId: number): Observable<void> {
    if (postId == null || postId <= 0) {
      throw new Error('Invalid video ID');
    }
    return this.http.post<void>(`${this.apiBaseUrl}/short-video/${postId}/view`, {});
  }

 
  getPost(type: 'video' | 'article' | 'image', postId: number): Observable<any> {
    let url = '';
    switch (type) {
      case 'video':
        url = `${this.apiBaseUrl}/long-video/short-videos/${postId}`;
        break;
      case 'article':
        url = `${this.apiBaseUrl}/api/articleposts/${postId}`;
        break;
      case 'image':
        url = `${this.apiBaseUrl}/api/imagePosts/${postId}`;
        break;
    }
    return this.http.get<any>(url);
  }
 
  deleteComment(type: 'video' | 'article' | 'image', postId: number, commentId: number): Observable<void> {
    const url = this.deleteCommentApiUrl(type, postId, commentId);
    return this.http.delete<void>(url);
  }
 
  private deleteCommentApiUrl(type: 'video' | 'article' | 'image', postId: number, commentId: number): string {
    switch (type) {
      // case 'video':
      //   return `${this.apiBaseUrl}/short-video/${postId}/comment/${commentId}`;
      case 'article':
        return `${this.apiBaseUrl}/api/comments/${commentId}`;
      case 'image':
        return `${this.apiBaseUrl}/api/comments/${commentId}`;
      default:
        return '';
    }
  }
 
 
 
 
 
  likeCommentshort(videoId: number, commentId: number, userId: number): Observable<any> {
    const url = `${this.apiBaseUrl}/short-video/${videoId}/comment/${commentId}/like/${userId}`;
    return this.http.post<any>(url, {});
  }

  getNestedComments(parentCommentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/short-video/comment/${parentCommentId}/nested-comments`);
  }
  likeNestedComment(nestedCommentId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/short-video/nested-comment/${nestedCommentId}/like/${userId}`, {});
  }



 
 
 
  fetchRecommendations(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/user/all`,);
  }
 
 
 
 
  uploadUserImage(userId: number, image: File) {
    const formData = new FormData();
    formData.append('image', image, image.name);
    return this.http.post<string>(`${this.apiBaseUrl}/user/${userId}/uploadImage`, formData);
  }



  isVideoLikedByUser(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiBaseUrl}/long-video/is-liked/${postId}/${userId}`);
  }



  isPostLikedByUser(postId: number, id: number, postType: string): Observable<boolean> {
    let endpoint: string;
    switch (postType) {
      case 'video':
        endpoint = `${this.apiBaseUrl}/long-video/is-liked/${postId}/${id}`;
        break;
      case 'image':
        endpoint = `${this.apiBaseUrl}/api/imagePosts/${postId}/liked-by/${id}`;
        break;
      case 'article':
        endpoint = `${this.apiBaseUrl}/api/articleposts/${postId}/liked-by/${id}`;
        break;
      default:
        throw new Error('Invalid post type');
    }
    return this.http.get<boolean>(endpoint);
  }

  isShortVideoLikedByUser(postId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiBaseUrl}/short-video/is-liked/${postId}/${userId}`);
  }
  // =================================================DELETE COMMENT===========================================================

  deleteArticleComment(articleId: number, commentId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/api/comments/article/${articleId}/${commentId}?userId=${userId}`);
  }

  deleteImageComment(imageId: number, commentId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/api/comments/image/${imageId}/${commentId}?userId=${userId}`);
  }

  deleteVideoComment(videoId: number, commentId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/long-video/${videoId}/comment/${commentId}?userId=${userId}`);
  }


  deleteNestedComment(nestedCommentId: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/long-video/nested-comment/${nestedCommentId}`);
  }

  deleteNestedCommentWithUserId(nestedCommentId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/api/comments/${nestedCommentId}/nested?userId=${userId}`);
  }

  editComment(postType: string, postId: number, commentId: number, userId: number, newContent: string): Observable<any> {
    let apiUrl = '';
    let params = new HttpParams().set('userId', userId.toString());
    
    switch (postType) {
      case 'video':
        apiUrl = `${this.apiBaseUrl}/long-video/comment/${postId}/${commentId}/edit`;
        params = params.set('newContent', newContent);
        break;
      case 'article':
        apiUrl = `${this.apiBaseUrl}/api/comments/comment/${commentId}/edit`;
        params = params.set('newText', newContent);
        break;
      case 'image':
        apiUrl = `${this.apiBaseUrl}/api/comments/comment/${commentId}/edit`;
        params = params.set('newText', newContent);
        break;
      default:
        throw new Error('Unsupported post type');
    }
  
    return this.http.put(apiUrl, null, { params });
  }

  editNestedComment(nestedCommentId: number, userId: number, newContent: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('newContent', newContent);
    return this.http.put(`${this.apiBaseUrl}/api/comments/nested/${nestedCommentId}/edit`, null, { params });
  }

  // For video
  editVideoNestedComment(nestedCommentId: number, userId: number, newContent: string): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/long-video/nested/${nestedCommentId}/${userId}/edit?newContent=${encodeURIComponent(newContent)}`, null);
  }
  
  editVideoCommentShort(videoId: number, commentId: number, userId: number, newContent: string): Observable<any> {
    const url = `${this.apiBaseUrl}/short-video/comment/${videoId}/${commentId}/edit`;
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('newContent', newContent);
    return this.http.put<any>(url, {}, { params });
  }

  // Edit a nested comment on a video
  editVideoNestedCommentShort(nestedCommentId: number, userId: number, newContent: string) {
    const url = `${this.apiBaseUrl}/short-video/nested/${nestedCommentId}/${userId}/edit`;
    const params = new HttpParams().set('newContent', newContent);
    return this.http.put(url, {}, { params });
}












// ============================================  SHORTS  ===========================================
performShortVideoAction(
  action: string,
  postId: number,
  userId: number,
  content?: string,
  commentId?: string,
  parentCommentId?: number,
): Observable<any> {
  let url = `${this.apiBaseUrl}/short-video`; // Adjust base URL for short videos
  let body = {};

  // Determine if action is for long or short videos
  if (action.startsWith('short-')) {
    url = `${this.apiBaseUrl}/short-video`;
    action = action.substring(5); // Remove 'short-' prefix
  }

  switch (action) {
    case 'like':
      url += `/${postId}/like?userId=${userId}`;
      break;
    case 'share':
      url += `/${postId}/share`;
      break;
    case 'comment':
      url += `/${postId}/comment/${userId}?content=${encodeURIComponent(content || '')}`;
      body = { content };
      break;
    case 'likeComment':
      url += `/short-video/${postId}/comment/${commentId}/like/${userId}`;
      break;
    case 'replyComment':
      if (typeof parentCommentId !== 'number' || isNaN(parentCommentId)) {
        throw new Error('Invalid parentCommentId');
      }
      url += `/nested/${parentCommentId}/${userId}?content=${encodeURIComponent(content || '')}`;
      body = { content };
      break;
    case 'getComments':
      return this.http.get(`${url}/${postId}/comments`);
    case 'getReplies':
      return this.http.get(`${url}/comment/${parentCommentId}/nested-comments`);
    default:
      throw new Error('Unsupported action');
  }

  return this.http.post(url, body);
}


addNestedComment(parentCommentId: number, userId: number, content: string): Observable<any> {
  const url = `${this.apiBaseUrl}/short-video/nested/${parentCommentId}/${userId}`;
  return this.http.post<any>(url, null, { params: { content } });
}




deleteNestedCommentShorts(nestedCommentId: number): Observable<string> {
  return this.http.delete<string>(`${this.apiBaseUrl}/short-video/nested-comment/${nestedCommentId}`);
}

deleteCommentShorts(postId: number, commentId: number, userId: number): Observable<string> {
  const params = new HttpParams().set('userId', userId.toString());
  return this.http.delete<string>(`${this.apiBaseUrl}/short-video/${postId}/comment/${commentId}`, { params });
}







 
 
  // getComments(type: 'video' | 'article' | 'image', postId: number): Observable<Comment[]> {
  //   const url = this.getCommentsApiUrl(type, postId);
  //   return this.http.get<Comment[]>(url);
  // }
  /////save///
  getSavedArticlePosts(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/getSavedArticlePosts?userId=${userId}`);
  }
 
  getSavedShortVideos(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/getSavedShortVideos?userId=${userId}`);
  }
  getSavedImagePosts(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/getSavedImagePosts?userId=${userId}`);
  }
  // unsavePost(postId: number, userId: number): Observable<any> {
  //   return this.http.delete(`${environment.apiBaseUrl}/savedItems/deleteSavedItem`, {
  //     params: new HttpParams()
  //       .set('postId', postId.toString())
  //       .set('userId', userId.toString())
  //   }).pipe(
  //     tap(() => console.log('Post unsaved successfully')),
  //     catchError((error: any) => {
  //       console.error('Error unsaving post:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

savePost(saveEndpoint: string, userId: number, postId: number, postIdParam: string): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}/savedItems/${saveEndpoint}?userId=${userId}&${postIdParam}=${postId}`,
      {},
      { responseType: 'text' }
    ).pipe(
      map(response => {
        if (response === 'Item already saved') {
          throw new HttpErrorResponse({
            error: 'Item already saved',
            status: 200,
            statusText: 'OK'
          });
        }
        return JSON.parse(response);
      }),
      catchError(error => {
        if (error.error === 'Item already saved') {
          return throwError(error);
        }
        return throwError('An error occurred while saving the post.');
      })
    );
  }
  getSavedItemId(postType: string, userId: number, postId: number): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}/savedItems/getSavedItemId?userId=${userId}&postType=${postType}&postId=${postId}`);
  }
 
  unsavePost(deleteEndpoint: string, userId: number, postId: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/savedItems/${deleteEndpoint}?userId=${userId}&${this.getPostIdParam(deleteEndpoint)}=${postId}`);
  }
 
  private getPostIdParam(deleteEndpoint: string): string {
    switch (deleteEndpoint) {
      case 'deleteImagePost':
        return 'imagePostId';
      case 'deleteArticlePost':
        return 'articlePostId';
      case 'deleteShortVideo':
        return 'shortVideoId';
      case 'deleteLongVideo':
        return 'longVideoId';
      default:
        throw new Error('Unknown delete endpoint');
    }
  }
  getSavedStatus(userId: number, postIds: number[]): Observable<{[key: number]: boolean}> {
    return this.http.post<{[key: number]: boolean}>('/api/getSavedStatus', { userId, postIds });
  }
  getAllSavedItems(userId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/savedItems/getAllSavedItems?userId=${userId}`);
  }
 
 

  //save

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/user/find/${id}`);
  }
 
  createImagePost(userId: number, file: File, description: string,tag:string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('photo', file, file.name);
    formData.append('imageDescription', description);
    formData.append('tag', tag);

    return this.http.post(`${this.apiBaseUrl}/api/imagePosts/create`, formData);
  }
  
  getCommentCount1(videoId: number): Observable<number> {
    const url = `${this.apiBaseUrl}/short-video/${videoId}/comment-count`;
    return this.http.get<number>(url);
  }
  getCommentCount(postId: number, postType: 'video' | 'article' | 'image'): Observable<number> {
    let url = '';

    switch (postType) {
      case 'video':
        url = `${this.apiBaseUrl}/long-video/${postId}/comment-count`;
        break;
      case 'article':
        url = `${this.apiBaseUrl}/count/articlepost/${postId}`;
        break;
      case 'image':
        url = `${this.apiBaseUrl}/count/imagepost/${postId}`;
        break;
      default:
        throw new Error('Invalid post type');
    }

    return this.http.get<number>(url);
  }
  uploadLongVideo(userId: number, file: File, description: string,tag:string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('longVideoDescription', description);
    formData.append('tag', tag);

    formData.append('userId', userId.toString());
 
    return this.http.post(`${this.apiBaseUrl}/long-video/upload/${userId}`, formData);
  }
  uploadShortVideo(userId: number, file: File, shortVideoDescription: string,tag:string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('shortVideoDescription', shortVideoDescription);
    formData.append('tag', tag);

    formData.append('userId', userId.toString());
 
 
    return this.http.post(`${this.apiBaseUrl}/short-video/upload/${userId}`, formData);
  }
 
 
 
 
  // getComments(videoId: number): Observable<any> {
  //   const url = `${this.apiBaseUrl}short-video/${videoId}/comments`;
  //   return this.http.get<any>(url);
  // }
  createArticlePost(userId: number, content: string): Observable<any> {
    const params = { userId, article: content };
    return this.http.post(`${this.apiBaseUrl}/api/articleposts/create`, null, { params });
  }
 
  getAllArticlePosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/api/articleposts/getAll`);
  }
  // likeVideo(videoId: number): Observable<void> {
  //   return this.http.post<void>(`${this.apiBaseUrl}/short-video/${videoId}/like`, {});
  // }
  getAllLongVideos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/long-video/long-videos`);
  }
  feedShortVideos(requestBody: { user_id: string }): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiBaseUrl}/feedShortVideos`, requestBody);
  }
  fetchAIRecommendations(userId: number): Observable<any[]> {
    if (!this.feedCache$) { // Check if cache is empty
      const body = { user_id: userId };
      this.feedCache$ = this.http.post<any[]>(`${this.apiBaseUrl}/feedRecommendations`, body).pipe(
        shareReplay(1), // Cache the response for future subscribers
        catchError(error => {
          console.error('Error fetching AI recommendations:', error);
          this.feedCache$ = undefined; // Reset cache on error
          return of([]); // Return empty array on error
        })
      );
    }
    return this.feedCache$; // Return cached data or the new HTTP request
  }

  // Optional: Method to clear the cache (if needed)
  clearFeedCache(): void {
    this.feedCache$ = undefined; // Clear the cached data
  }

 
  getAllImagePosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/api/imagePosts/getAll `);
  }
  postComment(postId: string, comment: string): Observable<any> {
    const url = `${this.apiBaseUrl}/create`;
    const body = { postId, comment };
    return this.http.post<any>(url, body);
  }
 
  // likePost(postId: string): Observable<any> {
  //   const url = `${this.apiBaseUrl}/${postId}/like`;
  //   return this.http.post<any>(url, {});
  // }
 
  dislikePost(postId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/${postId}/dislike`;
    return this.http.post<any>(url, {});
  }
 
  // sharePost(postId: string): Observable<any> {
  //   const url = `${this.apiBaseUrl}/${postId}/share`;
  //   return this.http.post<any>(url, {});
  // }
 
  getPostDetails(postId: string): Observable<any> {
    const url = `${this.apiBaseUrl}/${postId}`;
    return this.http.get<any>(url);
  }
 


  getAllPosts(): Observable<any[]> {
    return forkJoin({
      articles: this.getAllArticlePosts().pipe(
        map(posts => posts.map(post => ({ ...post, type: 'article', isArticle: true, timestamp: new Date(post.timestamp || post.createdAt) })))
      ),
      videos: this.getAllLongVideos().pipe(
        map(posts => posts.map(post => ({ ...post, type: 'video', isVideo: true, timestamp: new Date(post.timestamp || post.createdAt) })))
      ),
      images: this.getAllImagePosts().pipe(
        map(posts => posts.map(post => ({ ...post, type: 'image', isImage: true, timestamp: new Date(post.timestamp || post.createdAt) })))
      )
    }).pipe(
      map((responses) => {
        // Combine all posts into one array
        const allPosts = [
          ...responses.articles,
          ...responses.videos,
          ...responses.images
        ];
  
        // Sort the combined array based on the timestamp
        allPosts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
        return allPosts;
      })
    );
  }
 
  getAllPosts1(): Observable<any> {
    const url = `${this.apiBaseUrl}`;
    return this.http.get<any>(url);
  }
 
  getFollowerCount(followerId: number): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}/follow/sumFollowerCounts/${followerId}`);
  }
 
  getFollowingCount(followingId: number): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}/follow/sumFollowingCounts/${followingId}`);
  }
 
 
  // ---------------
  postBYid(articlId: any) {
    return this.http.post<any[]>(`${this.apiBaseUrl}/api/articleposts/${articlId}/like`, "");
  }
  postArticleshare(articleId: any) {
    return this.http.post<any[]>(`${this.apiBaseUrl}/api/articleposts/${articleId}/share`, "");
  }



  feedUserShortVideos(requestBody: { user_id: string }): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiBaseUrl}/feedShortVideos`, requestBody);
  }
 
  getAllUserShortVideos(userId:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/short-video/short-videos/getAll/${userId}`);
  }
  getAllUserImagePosts(userId:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/api/imagePosts/user/${userId}`);
  }

  getAllUserArticlePosts(userId:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/api/articleposts/user/${userId}`);
  }
  getAllUserLongVideos(userId:number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/long-video/longVideos/${userId}`);
  }
 
  getShortVideos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/short-video/short-videos`);

  }


////////save ////
// savePost(postId: string): Observable<any> {
//   return this.http.post(`${this.apiBaseUrl}/posts/savePost`, {});
// }
 
// unsavePost(postId: string): Observable<any> {
//   return this.http.delete(`${this.apiBaseUrl}/posts/${postId}/save`);
// }
 
 
 
 
 
////save/////
 
 
 
 
 
 
 
 
 
 

// unsavePost(postId: string): Observable<any> {
//   return this.http.delete(`${this.apiBaseUrl}/posts/${postId}/save`);
// }





////save/////












  getWatchedPercentage(): Observable<{ watchedPercentage: number, lastWatchedTime: number }> {
    return this.http.get<{ watchedPercentage: number, lastWatchedTime: number }>('your-api-endpoint');
  }

  saveProgress() { }


// ========================================ProfileComponent============================================================

updatePost(postId: string, postType: string, updatedDescription: string, photoFile?: File, tag?: string): Observable<any> {
  let endpoint: string;
  let formData: FormData = new FormData();

  switch (postType) {
    case 'video':
      endpoint = `${this.apiBaseUrl}/long-video/update/${postId}`; // Endpoint for updating a long video description
      formData.append('longVideoDescription', updatedDescription); // Add description to FormData
      if (tag) {
        formData.append('tag', tag); // Add tag if provided
      }
      break;
      
    case 'image':
      endpoint = `${this.apiBaseUrl}/api/imagePosts/update/${postId}`; // Endpoint for updating an image post
      if (photoFile) {
        formData.append('photo', photoFile); // Add photo to FormData if provided
      }
      formData.append('imageDescription', updatedDescription); // Add description to FormData
      if (tag) {
        formData.append('tag', tag); // Add tag if provided
      }
      break;
      
    case 'article':
      endpoint = `${this.apiBaseUrl}/api/articleposts/${postId}`; // Endpoint for updating an article post
      formData.append('article', updatedDescription); // Add article to FormData
      if (tag) {
        formData.append('tag', tag); // Add tag if provided
      }
      break;

    default:
      throw new Error('Invalid post type');
  }

  return this.http.put(endpoint, formData);
}


deletePost(postId: string, postType: string): Observable<any> {
  let endpoint: string;

  switch (postType) {
    case 'video':
      endpoint = `${this.apiBaseUrl}/long-video/delete/${postId}`;
      break;
    case 'image':
      endpoint = `${this.apiBaseUrl}/api/imagePosts/delete/${postId}`;
      break;
    case 'article':
      endpoint = `${this.apiBaseUrl}/api/articleposts/delete/${postId}`;
      break;
    default:
      throw new Error('Invalid post type');
  }

  return this.http.delete(endpoint);
}



















   





  //////////////////////////////// *MENTOR* //////////////////////////////////////////
  getCourseToolsByCourseId(courseId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/courseTools/course/${courseId}`);
  }
///////////// post course resourse document //////
uploadResourseDocuments(courseId: number, files: File[]): Observable<any> {
  const formData: FormData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');

  return this.http.post(`${this.apiBaseUrl}/${courseId}/documents`, formData, { headers });
}
///////////// get course resourse document //////
getDocumentsByCourseId(courseId: number): Observable<CourseDocuments[]> {
  return this.http.get<CourseDocuments[]>(`${this.apiBaseUrl}/${courseId}/documents`);
}
///////////// delete course resourse document //////
deleteDocumentById(documentId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiBaseUrl}/documents/${documentId}`);
}

  /////////get course by userID ////////

  // Method to fetch course data by courseId
  getCourseById(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/course/getCourse/${courseId}`, {
      responseType: 'json'
    });
  }
  // Method to fetch course data by courseId for update
  getCourseByIdupdate(courseId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/course/getCourse/${courseId}`, { observe: 'response', responseType: 'json' });
  }
  getCourseImage(courseId: number): Observable<Blob> {
    return this.http.get(`${this.apiBaseUrl}/course/getCourseImage/${courseId}`, { responseType: 'blob' });
  }
  // Method to fetch course tools by courseId
  getCourseTools(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/courseTools/course/${courseId}`, {
      responseType: 'json'
    });
  }
  // update courseTools
  updateCourseTool(tool: any): Observable<any> {
    const url = `${this.apiBaseUrl}/courseTools/updateTool/${tool.id}`;
    return this.http.put<any>(url, tool);
  }

  //////////////// get lesson by course /////////////////
  getLessonsByCourse(courseId: number): Observable<Lesson1[]> {
    return this.http.get<Lesson1[]>(`${this.apiBaseUrl}/lesson/course/${courseId}`);
  }
  ////Mentor get lessons by course /////////////
  getLessonsByCourseId(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/lesson/course/${courseId}`);
  }


  //////// get videos by courseId

  getVideosByCourse(courseId: number): Observable<Video234[]> {
    return this.http.get<Video234[]>(`${this.apiBaseUrl}/video/courses/videos/${courseId}`);
  }

    // Method to get videos by lessonId
    getVideosByShotLessonId(lessonId: number): Observable<Video1234[]> {
      return this.http.get<Video1234[]>(`${this.apiBaseUrl}/videos/lesson/${lessonId}`);
    }

  ////////// Delete lesson videos //////
  deleteVideoById(id: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/video/delete/${id}`, { responseType: 'text' });
  }



  // update courseTools
  CourseToolsUpdate(courseId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/courseTools/${courseId}`, formData);
  }

  ////////////// Mentor get course fee ////////////////
  getCourseFeeDetails(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiBaseUrl}/course/${id}/details`);
  }
  updateCourseFee(courseId: number, updateData: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/courses/updatefee/${courseId}`, updateData);
  }



  ///////////// Mentor get project with courseId//////////////
  getProjectsByCourse(courseId: number): Observable<Project12[]> {
    return this.http.get<Project12[]>(`${this.apiBaseUrl}/project/course/${courseId}`);
  }
  // In your service
  updateProjects(projectId: number, projectData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiBaseUrl}/project/updateProjectsBy/${projectId}`, projectData);
  }
  

  updateProject(courseId: number, formData: FormData): Observable<Project12> {
    return this.http.put<Project12>(`${this.apiBaseUrl}/project/updateProjects/${courseId}`, formData);
  }

  // Mentor update course
  updateCourse(courseId: number, courseData: FormData): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/course/updateNewCourse/${courseId}`, courseData);
  }



  /////////Mentor update lesson //////////////////////
  updateLesson(courseId: number, lessonId: number, updatedLesson: Lesson1): Observable<Lesson> {
    const lessonData = {
      id: updatedLesson.id,
      lessonTitle: updatedLesson.lessonTitle,
      lessonContent: updatedLesson.lessonContent,
      lessonDescription: updatedLesson.lessonDescription,
      lessonDuration: updatedLesson.lessonDuration,
      // Map other properties as needed
    };

    return this.http.put<Lesson>(`${this.apiBaseUrl}/lesson/updateLessonByCourse/${courseId}/${lessonId}`, lessonData);
  }

 // Mentor upload videos to lesson
uploadVideos(formData: FormData, courseId: number, lessonId: number): Observable<any> {
  return this.http.post(`${this.apiBaseUrl}/video/upload/${courseId}/${lessonId}`, formData, { responseType: 'text' });
}



  /////////// Mentor update lesson video


  uploadVideoupdate(courseId: number, lessonId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    const req = new HttpRequest('POST', `${this.apiBaseUrl}/video/upload/${courseId}/${lessonId}`, formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / (event.total ?? 1));
          return { status: 'progress', message: progress };
        } else if (event.type === HttpEventType.Response) {
          return { status: 'completed', message: event.body };
        } else {
          return { status: 'unknown', message: 'Unknown event type' };
        }
      }),
      catchError(error => {
        return throwError(() => new Error(error.message || 'File upload failed.'));
      })
    );
  }

  ////////////////////////////// PROJECT  /////////////////////////////
  addProject(courseId: number, projectTitle: string, projectDescription: string, projectDeadline: string, document: File): Observable<Project> {
    const formData: FormData = new FormData();
    formData.append('file', document);
    formData.append('projectTitle', projectTitle);
    formData.append('projectDescription', projectDescription);
    formData.append('projectDeadline', projectDeadline);

    return this.http.post<Project>(`${this.apiBaseUrl}/project/addProject/${courseId}`, formData);
  }

  uploadProject(followerId: number, courseId: number, title: string, description: string, document: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', document);
    formData.append('title', title);
    formData.append('description', description);

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return this.http.post(`${this.apiBaseUrl}/project/addProject/${courseId}`, formData, { headers });
  }

  saveCourseTool(courseId: number, toolName: string, skillName: string, toolImage: File, skillImage: File, coursePrerequisites: string): Observable<any> {

    const formData = new FormData();
    formData.append('toolName', toolName);
    formData.append('skillName', skillName);
    formData.append('file', toolImage, toolImage.name);
    formData.append('file2', skillImage, skillImage.name);

    formData.append('coursePrerequisites', coursePrerequisites);


    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<any>(`${this.apiBaseUrl}/courseTools/saveCourseTool/${courseId}`, formData, { headers });

  }

  ///////////Mentor update course tools
  updateCourseTools(courseId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/courseTools/${courseId}`, formData);
  }


  createLesson(lesson: Lesson2, courseId: number): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.apiBaseUrl}/lesson/add/${courseId}`, lesson);
  }
  // createLesson(lesson: Lesson2, courseId: number): Observable<Lesson> {
  //   return this.http.post<Lesson>(`${this.apiBaseUrl}/lesson/add/${courseId}`, lesson);
  // }
  //////////upload Course Demo Video //////////////////
  uploadVideoCourseDemoVideo(courseId: number, file: File, description: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    const headers = new HttpHeaders().append('enctype', 'multipart/form-data');

    return this.http.post(`${this.apiBaseUrl}/upload/${courseId}`, formData, { headers, responseType: 'text' });
  }
  //////////////create Quiz by lessonId
  createLessonQuiz(quiz: Quiz, lessonId: number): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.apiBaseUrl}/api/quizzes/add/${lessonId}`, quiz);
  }

   //////////////create Quiz by courseId
   createCourseQuiz(quiz: Quiz, courseId: number): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.apiBaseUrl}/api/quizzes/add/${courseId}`, quiz);
  }
 //////////////create Quiz by courseId to course
  saveQuiz(courseId: number, teacherId: number, quizData: any): Observable<any> {
    const url = `${this.apiBaseUrl}/api/quizzes/course/${courseId}/teacher/${teacherId}`;
    return this.http.post(url, quizData);
  }
  // addQuestionsToQuiz(quizId: number, questions: Question[]): Observable<Quiz> {
  //   return this.http.post<Quiz>(`${this.apiBaseUrl}/api/quizzes/${quizId}/questions`, questions);
  // }

  addQuestionsToQuiz(quizId: number, questions: Question[]): Observable<any> {
    // Transform the questions to match the backend structure
    const transformedQuestions = questions.map(question => ({
      text: question.text,
      optionA: question.options[0]?.text,
      optionB: question.options[1]?.text,
      optionC: question.options[2]?.text,
      optionD: question.options[3]?.text,
      correctAnswer: question.correctAnswer
    }));

    return this.http.post<any>(`${this.apiBaseUrl}/api/quizzes/${quizId}/questions`, transformedQuestions);
  }

  /////////////////////// Create Module //////////
  createLessonModule(lessonModule: { moduleName: string }, courseId: number): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/addLessonModule/${courseId}`, lessonModule);
  }


  createModuleLesson(lesson: Lesson2, lessonModuleId: number): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/lesson/addLesson/${lessonModuleId}`, lesson);
  }
///////////////// student tab table /////////////
getTeacherPostedItems(teacherId: number): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiBaseUrl}/teacher-items?teacherId=${teacherId}`);
}

  /////////////////////////////////////// *MENTOR OVER* //////////////////////////////////////////////////


  // createLesson(lesson: Lesson2, courseId: number): Observable<Lesson> {
  //   return this.http.post<Lesson>(`${this.apiBaseUrl}/lesson/add/${courseId}`, lesson);
  // }
  createCoupons(
    courseId: number,
    discountPercentage: number,
    promoCodeExpiration: string,
    courseFee: number,
    currency: string
  ): Observable<any> {
    // Build the query parameters
    const params = new HttpParams()
      .set('discountPercentage', discountPercentage.toString())
      .set('promoCodeExpiration', promoCodeExpiration)
      .set('courseFee', courseFee.toString())
      .set('currency', currency);
  
    // Send the PUT request
    return this.http.put<any>(`${this.apiBaseUrl}/course/updatePromoCode/${courseId}`, null, { params });
  }
  
  createCoupon(
    courseId: number,
    discountPercentage: number,
    promoCodeExpiration: string,
    courseFee: number,
    currency: string,
    coursePercentage: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('discountPercentage', discountPercentage.toString())
      .set('promoCodeExpiration', promoCodeExpiration)
      .set('coursePercentage', coursePercentage.toString())
      .set('courseFee', courseFee.toString())
      .set('currency', currency);

    return this.http.post<any>(`${this.apiBaseUrl}/course/generatePromoCode/${courseId}`, null, { params });
  }

  getPromoCode(courseId: number): Observable<string> {
    return this.http.get<string>(`${this.apiBaseUrl}/course/getPromoCode/${courseId}`, { responseType: 'text' as 'json' });
  }

  // getFollowerCount(followerId: number): Observable<number> {
  //   return this.http.get<number>(`${this.apiBaseUrl}/follow/sumFollowerCounts/${followerId}`);
  // }

  // getFollowingCount(followingId: number): Observable<number> {
  //   return this.http.get<number>(`${this.apiBaseUrl}/follow/sumFollowingCounts/${followingId}`);
  // }

  // getUserById(followerId: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiBaseUrl}/user/find/${followerId}`);
  // }

  // postBYid(articleId: any) {
  //   return this.http.post<any[]>(`${this.apiBaseUrl}/api/articleposts/${articleId}/like`, "");
  // }

  // postArticleshare(articleId: any) {
  //   return this.http.post<any[]>(`${this.apiBaseUrl}/api/articleposts/${articleId}/share`, "");
  // }

  // Dummy data
  private courses = [
    { id: '1', name: 'Course 1' },
    { id: '2', name: 'Course 2' },
  ];
  private lessons: { [key: string]: Lesson[] } = {


  };




  private quizzes = [
    { id: '1', name: 'Quiz 1' },
    { id: '2', name: 'Quiz 2' },
  ];

  private quizResults = [
    { userName: 'John Doe', userId: 'JD001', marks: 85 },
    { userName: 'Jane Smith', userId: 'JS002', marks: 92 },
  ];

  private feedbackComments = [
    { user: 'User1', comment: 'Great course!', date: new Date('2023-06-01'), replies: [] },
    { user: 'User2', comment: 'Very informative.', date: new Date('2023-06-02'), replies: [] },
    { user: 'User3', comment: 'Helped me a lot.', date: new Date('2023-06-03'), replies: [] },
  ];

  getCourses(): Observable<any[]> {
    return of(this.courses);
  }





  getQuizzes(lessonId: string): Observable<any[]> {
    return of(this.quizzes);
  }

  getQuizResults(quizId: string): Observable<any[]> {
    return of(this.quizResults);
  }

  getFeedbackComments(): Observable<any[]> {
    return of(this.feedbackComments);
  }


  createQuiz(quiz: any, lessonId: number): Observable<any> {
    const url = `${this.apiBaseUrl}/api/quizzes/add/3`;
    return this.http.post<any>(url, quiz)
      .pipe(
      // catchError(this.handleError)
    );
  }
  uploadAssignment(lessonId: number,
    assignmentTitle: string, assignmentTopicName: string,
    file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('assignmentTitle', assignmentTitle);
    formData.append('assignmentTopicName', assignmentTopicName);
    // return this.http.post(`${this.apiBaseUrl}/add/${followerId}/${lessonId}`, formData);

    return this.http.post(`${this.apiBaseUrl}/add/${lessonId}`, formData);
  }

  createQuiz1(quizData: any): Observable<any> {
    const formData = new FormData();
 
    // Ensure all fields are present and not undefined
    if (quizData.courseId) formData.append('courseId', quizData.courseId.toString());
    if (quizData.quizName) formData.append('quizName', quizData.quizName);
    if (quizData.studentIds) formData.append('studentIds', quizData.studentIds.join(','));
    if (quizData.teacherId) formData.append('teacherId', quizData.teacherId.toString());
    if (quizData.startDate) formData.append('startDate', quizData.startDate);
    if (quizData.endDate) formData.append('endDate', quizData.endDate);
   
 
    return this.http.post(`${this.apiBaseUrl}/api/quizzes/createQuiz`, formData);
  }
 
  addQuestionsToQuiz1(quizId: number, questions: any[]): Observable<any> {
    const transformedQuestions = questions.map(question => ({
      text: question.text,
      optionA: question.options?.[0]?.text || '',
      optionB: question.options?.[1]?.text || '',
      optionC: question.options?.[2]?.text || '',
      optionD: question.options?.[3]?.text || '',
      correctAnswer: question.correctAnswer
    }));
 
    return this.http.post<any>(`${this.apiBaseUrl}/api/quizzes/${quizId}/questions`, transformedQuestions);
  }
 
  getQuizById(quizId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/api/quizzes/${quizId}/questions`);
  }
  getQuizzesByTeacher(teacherId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/api/quizzes/${teacherId}/course-quiz-details`);
  }
  // ---------------




  // uploadVideos(formData: FormData, courseId: number, lessonId: number): Observable<any> {
  //   return this.http.post(`${this.apiBaseUrl}/video/upload/${courseId}/${lessonId}`, formData);
  // }



  // -----------------------------mentor add course ----------------------------------
  saveCourse234(userId: string, courseData: FormData): Observable<any> {
    const url = `${this.apiBaseUrl}/course/saveNewCourse/${userId}`;
    return this.http.post(url, courseData);
  }
  saveCourseOnline(courseData: any): Observable<any> {
    const userId = 'your-user-id'; // Replace with actual user ID logic
    return this.http.post(`${this.apiBaseUrl}/saveCourse/${userId}`, courseData);
  }
///////////////// course resourse document
  uploadCourseDocument(courseId: number, document: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('document', document, document.name);

    return this.http.post(`${this.apiBaseUrl}/course/${courseId}/document`, formData, {
      responseType: 'text',
    });
  }
  // ------------------------ mentor perspective component--------------------------
  deleteCourseById(courseId: any) {
    return this.http.delete(`${this.apiBaseUrl}/course/delete/${courseId}`)
  }
  // -----  getting data by using course id --------
  getCourseByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/course/user/${userId}`);
  }
  getAllShortVideos2(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/short-video/short-videos`)
      .pipe(catchError(this.handleError));
  }

  uploadShortVideo2(userId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiBaseUrl}/short-video/upload/${userId}`, formData)
      .pipe(catchError(this.handleError));
  }
  // ------------------------ mentor perspective Anouncmetns--------------------------

  saveAnnouncement(courseId: number, announcement: any): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/api/announcements/saveAnnouncement/${courseId}`, announcement);
  }

  getAllAnnouncements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/api/announcements/allAnnouncement`);
  }
  getAnnouncementById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/api/announcements/ByAnnouncement/8`);
  }


  getContactUSr() {
    return this.http.get<any>(`${this.apiBaseUrl}/user/all`);
  }
  fetchCourseByUserId(courseId: number, userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/course/user/3`);
  }
  getCourseEnrollments(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/course/enrollments/${courseId}`);
  }


  ///////////////////// MENTOR DASHBOARD OVER VIEW ///////////////////////////
getOverview(userId: number): Observable<DashboardOverview> {
  let params = new HttpParams().set('instructorId', userId.toString());
  return this.http.get<DashboardOverview>(`${this.apiBaseUrl}/api/dashboard/overview`, { params });
}

getUpcomingAssignments(userId: number): Observable<Assignment[]> {
  return this.http.get<Assignment[]>(`${this.apiBaseUrl}/upcoming/${userId}`);
}


getNotifications(userId: number): Observable<CustomNotification[]> {
  let params = new HttpParams().set('userId', userId.toString());
  return this.http.get<CustomNotification[]>(`${this.apiBaseUrl}/api/dashboard/notifications`, { params });
}
///////////////////////////// Analytics Dashboard //////////////////////////////
getCourseProgress(courseId: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/video/progress/percentage/course/${courseId}`);
}
///////////////////////////// Course Management//////////////////////////////
getCoursesByUserId(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiBaseUrl}/course/user/${userId}`);
}
////////////// sendAssignment individual ////////////////////////////
// sendAssignment(userId: number, formData: FormData): Observable<any> {
//   return this.http.post(`${this.apiBaseUrl}/sendAssignment/${userId}`, formData);
// }
////////////// send Assignment individual ////////////////////////////
createAssignmentIndividual(teacherId: number, studentId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.apiBaseUrl}/createByTeacher/${teacherId}/${studentId}`, formData);
}
////////////// send project individual ////////////////////////////

createProjectIndividual(teacherId: number, studentId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.apiBaseUrl}/project/createProjectToStudent/${teacherId}/${studentId}`, formData);
}
////////////// send Quiz individual ////////////////////////////
createLessonQuizIndividual(quiz: Quiz, teacherId: number, studentId: number): Observable<Quiz> {
  const url = `${this.apiBaseUrl}/createByTeacher/${teacherId}/${studentId}`;
  return this.http.post<Quiz>(url, quiz);
}

////////////// send project  to group ////////////////////////////

createProjectgroup(teacherId: number, studentId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.apiBaseUrl}/project/createProjectToStudent/${teacherId}/${studentId}`, formData);
}
// getCourseEnrollments(courseId: number): Observable<any[]> {
//   return this.http.get<any[]>(`${this.apiBaseUrl}/course/enrollments/${courseId}`);
// }

///////////////////////// Student Management /////////////////////////////////////
getEnrolledStudents(instructorId: number): Observable<Student[]> {
  return this.http.get<Student[]>(`${this.apiBaseUrl}/api/dashboard/enrolled-students?instructorId=${instructorId}`);
}
/////////////////////////// send & create Assignment to group //////////////////////////////
createAssignmentgroup(teacherId: number, studentId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.apiBaseUrl}/createByTeacher/${teacherId}/${studentId}`, formData);
}

/////////////////////////// send & create project to course //////////////////////////////
createProjectcourse(teacherId: number, courseId: number, formData: FormData): Observable<any> {
   const url = `${this.apiBaseUrl}/project/createByTeacherByCourse/${teacherId}/${courseId}`;
  return this.http.post(url, formData);
}

/////////////////////////// send & create Assignment to course //////////////////////////////
createAssignmentCourse(teacherId: number, courseId: number, formData: FormData): Observable<any> {
  const url = `${this.apiBaseUrl}/createByTeacherCourse/${teacherId}/${courseId}`;
  return this.http.post<any>(url, formData);
}



////////////////////////////////////////////////////////////
getLessonModulesByCourseId(courseId: number): Observable<Module[]> {
  return this.http.get<Module[]>(`${this.apiBaseUrl}/getModuleByCourse/${courseId}`);
}
getLessonsByModuleId(moduleId: number): Observable<any[]> {
  const url = `${this.apiBaseUrl}/lesson/module/${moduleId}`;
  return this.http.get<any[]>(url);
}
getModules(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiBaseUrl}/lesson/modules`); // Adjust the endpoint as per your API
}
updateModule(updatedModule: any): Observable<any> {
  const { courseId, id } = updatedModule; // Destructure updatedModule object
  return this.http.put<any>(`${this.apiBaseUrl}/updateByCourseIdAndId/${courseId}/${id}`, updatedModule);
}
updateLessonByLessonModuleId(lessonModuleId: number, lessonDetails: any): Observable<any> {
  return this.http.put<any>(`${this.apiBaseUrl}/lesson/lessonModule/${lessonModuleId}`, lessonDetails);
}
//////////////////// getting  lesson vedios /////////////

getVideosByLessonId(lessonId: number): Observable<Video234[]> {
  return this.http.get<Video234[]>(`${this.apiBaseUrl}/video/videos/lesson/${lessonId}`);
}
//////////////////// delete short lesson vedios /////////////
deleteVideo(id: number): Observable<string> {
  const url = `${this.apiBaseUrl}/video/delete/${id}`;
  return this.http.delete(url, { responseType: 'text' }); // Set responseType to 'text'
}



updateVideo(videoId: number, updatedVideo: Video234): Observable<Video234> {
  return this.http.put<Video234>(`${this.apiBaseUrl}/video/videos/${videoId}`, updatedVideo);
}
isEnrolledInAnyCourse(userId: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.apiBaseUrl}/enrollment/status/${userId}`);
}

getPostByUrl(url: string): Observable<any> {
  const fullUrl = `${this.apiBaseUrl}${url}`;
  return this.http.get(fullUrl);
}
 

// uploadAssignment3(
//   lessonId: number,
//   courseId: number,
//   assignmentTitle: string,
//   assignmentTopicName: string,
//   document: File,
//   startDate: string,
//   endDate: string,
//   reviewMeetDate: string
// ): Observable<any> {
//   const formData: FormData = new FormData();
//   formData.append('document', document);
//   formData.append('assignmentTitle', assignmentTitle?.toString());
//   formData.append('assignmentTopicName', assignmentTopicName?.toString());
//   formData.append('startDate', this.convertToLocalDateTime(startDate));
//   formData.append('endDate', this.convertToLocalDateTime(endDate));
//   formData.append('reviewMeetDate', this.convertToLocalDateTime(reviewMeetDate));
 
//   return this.http.post(`${this.apiBaseUrl}/saveLesson/${lessonId}/${courseId}`, formData);
// }
 
 
private convertToLocalDateTime(dateString: string): string {
  // Remove the 'Z' and truncate to seconds if milliseconds are present
  return dateString.replace('Z', '').split('.')[0];
}
getUserByIds(id: string): Observable<any> {

  return this.http.get(` http://54.165.131.215:8080/user/${id}`);


  // return this.http.get(`http://54.165.131.215:8080/user/${id}`);

  // return this.http.get(`http://54.165.131.215:8080/user/${id}`);

}
getMonthlyStats(courseId: number): Observable<any> {
  return this.http.get(`${this.apiBaseUrl}/course/${courseId}/monthlyStats`);  
}

///////////////////// COURSE TRAILER /////////////////////////// 
uploadVideoTrailer(courseId: number, file: File, title: string, description: string): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('description', description);

  return this.http.post(`${this.apiBaseUrl}/api/course/uploadTrailer/${courseId}`, formData);
}

///////////////////// GETTING COURSE TRAILER /////////////////////////// 

getVideoTrailersByCourseId(courseId: number): Observable<CourseVideoTrailer[]> {
  return this.http.get<CourseVideoTrailer[]>(`${this.apiBaseUrl}/api/course/getCourseTrailer/${courseId}`);
}
///////////////////// DELETE COURSE TRAILER /////////////////////////// 
deleteVideoTrailerById(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiBaseUrl}/api/course/${id}`);
}
  // Update course percentage by course ID
  updateCoursePercentage(id: number, newPercentage: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiBaseUrl}/course/${id}/updatePercentage`, newPercentage, { headers });
  }
  // Fetch videos by lesson ID
  getVideosLongByLessonId(lessonId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/video/videos/lesson/${lessonId}`);
  }
  updateCourseById(courseId: number, courseData: FormData): Observable<any> {
    console.log('Service: updateCourseById called with courseId:', courseId);
    // return this.http.post(`${this.apiBaseUrl}/course/saveNewCourseById/${courseId}`, courseData);
    return this.http.put(`${this.apiBaseUrl}/course/updateCourseById/${courseId}`, courseData);

  }

//   updateCourseById(courseId: number, courseData: FormData): Observable<any> {
//     console.log('Service: updateCourseById called with courseId:', courseId);
//     // Use PUT method to update the course
//     return this.http.put(`${this.apiBaseUrl}/course/updateCourseById/${courseId}`, courseData);
// }

  createCourse(userId: number, courseTitle: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('courseTitle', courseTitle);
    return this.http.post(`${this.apiBaseUrl}/course/get/saveCourseTitle`, null, { params });
  }
  getEnrolledUsersProgress(courseId: number): Observable<{ [key: string]: number }> {
    const url = `${this.apiBaseUrl}/video/progressByCourseByLesson/${courseId}`;
    console.log('Requesting URL for enrolled users progress:', url);
   
    return this.http.get<{ [key: string]: number }>(url).pipe(
      tap(response => console.log('Raw API response for enrolled users progress:', response)),
      catchError(this.handleError)
    );
  }
  getAssignmentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/getAssignment/${id}`);
  }
   
  getProjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/project/getBy/${id}`);
  }
  updateAssignment(assignmentId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/updateAssignmentMultiple/${assignmentId}`, formData)
      .pipe(
        catchError((error) => {
          console.error('Error updating assignment:', error);
          return throwError(error);
        }),
        map(response => {
          console.log('Assignment updated:', response);
          return response;
        })
      );
  }
  ///////////// update course project /////////
  // Update project with optional parameters
  updateCourseProject(
    projectId: number,
    projectTitle?: string,
    projectDescription?: string,
    teacherId?: number,
    projectDocument?: File,
    projectDeadline?: Date,
    startDate?: Date,
    reviewMeetDate?: Date,
    maxTeam?: number,
    gitUrl?: string
  ): Observable<any> {
    const formData: FormData = new FormData();
    if (projectTitle) formData.append('projectTitle', projectTitle);
    if (projectDescription) formData.append('projectDescription', projectDescription);
    if (teacherId) formData.append('teacherId', teacherId.toString());
    if (projectDocument) formData.append('projectDocument', projectDocument);
    if (projectDeadline) formData.append('projectDeadline', projectDeadline.toISOString());
    if (startDate) formData.append('startDate', startDate.toISOString());
    if (reviewMeetDate) formData.append('reviewMeetDate', reviewMeetDate.toISOString());
    if (maxTeam) formData.append('maxTeam', maxTeam.toString());
    if (gitUrl) formData.append('gitUrl', gitUrl);

    return this.http.put(`${this.apiBaseUrl}/updateProjectMultiple/${projectId}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  /////////////////
  updateProject1(projectId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/project/updateProjectMultiple/${projectId}`, formData)
      .pipe(
        catchError((error) => {
          console.error('Error updating project:', error);
          return throwError(error);
        }),
        map(response => {
          console.log('Project updated:', response);
          return response;
        })
      );
  }
  deleteAssignment(assignmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/deleteAssignment/${assignmentId}`);
  }
   
  deleteProject(Id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/project/delete/${Id}`); // Adjust the endpoint accordingly
  }
   
   
  //  ----------------------------------------
  uploadAssignment3(
    lessonId: number, 
    courseId: number, 
    assignmentTitle: string, 
    assignmentTopicName: string, 
    document: File, 
    startDate: string, 
    endDate: string, 
    reviewMeetDate: string,
    lessonModuleId?: number // Optional parameter
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('document', document);
    formData.append('assignmentTitle', assignmentTitle);
    formData.append('assignmentTopicName', assignmentTopicName);
    formData.append('startDate', startDate); // Ensure format is correct
    formData.append('endDate', endDate);     // Ensure format is correct
    formData.append('reviewMeetDate', reviewMeetDate); // Ensure format is correct
  
    const url = lessonModuleId 
      ? `${this.apiBaseUrl}/saveLessons/${lessonId}/${courseId}?lessonModuleId=${lessonModuleId}` 
      : `${this.apiBaseUrl}/saveLessons/${lessonId}/${courseId}`;
  
    return this.http.post(url, formData);
  }
  
///////////////
  // Fetch assignments by lessonId
  getAssignmentsByLessonId(lessonId: number): Observable<Assignment[]> {
    const url = `${this.apiBaseUrl}/lesson/${lessonId}`;
    return this.http.get<Assignment[]>(url);
  }
  
    getQuizDetails(quizId: number): Observable<QuizDetail> {
      return this.http.get<QuizDetail>(`${this.apiBaseUrl}/api/quizzes/getQuizDetails/${quizId}`);
    }
    updateQuizAndQuestions(quizId: number, quizDetail: any): Observable<string> {
      const params = new HttpParams()
        .set('quizName', quizDetail.quizName)
        .set('startDate', new Date(quizDetail.startDate).toISOString())
        .set('endDate', new Date(quizDetail.endDate).toISOString())
        .set('text', quizDetail.questions.length > 0 ? quizDetail.questions[0].text : '')
        .set('optionA', quizDetail.questions.length > 0 ? quizDetail.questions[0].optionA : '')
        .set('optionB', quizDetail.questions.length > 0 ? quizDetail.questions[0].optionB : '')
        .set('optionC', quizDetail.questions.length > 0 ? quizDetail.questions[0].optionC : '')
        .set('optionD', quizDetail.questions.length > 0 ? quizDetail.questions[0].optionD : '')
        .set('correctAnswer', quizDetail.questions.length > 0 ? quizDetail.questions[0].correctAnswer : '');
     
      return this.http.put(`${this.apiBaseUrl}/api/quizzes/updateMultipleQuiz/${quizId}`, null, {
        params: params,
        responseType: 'text',
      }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error in updateQuizAndQuestions: ', error);
          return throwError(() => new Error('Failed to update quiz'));
        })
      );
    }
   // Method in the service to delete a quiz
  deleteQuiz(quizId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/quizzes/${quizId}`);
  }
   
}