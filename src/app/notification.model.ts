import { SafeHtml } from '@angular/platform-browser';

export interface UserNotification {
  actionUserId: any;
  safeContent?: SafeHtml;
  content: any;
  userId?: string;
  read: any;
    id: number;
    url: string;
    description: string;
    title: string;
    isVideo: boolean;
    isImage: boolean;
    isArticle: boolean;
    src: string;
    likes: number;
    shares: number;
    timestamp: any;
    comments: any[];
    showComments: boolean;
    liked: boolean;
    showShareMenu: boolean;
    saved: boolean;
    profileImage: {
      changingThisBreaksApplicationSecurity: string;
    };
    profileName: string;
    contentType?: 'image' | 'short_video' | 'long_video' | 'article';
  
    actionUserImageBase64?: string; 
  }
 