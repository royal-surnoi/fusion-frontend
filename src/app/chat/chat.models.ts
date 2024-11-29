export interface Contact {
  unreadMessageCount: any;
  id: any;
  name: string;
  isGroup: boolean; // Add this line
  adminId?: number;
  newMemberName: string;
  senderId?: number;
  receiverId?: number;
  lastMessage?: string;
  messages: Message[];
  imageUrl: string;
  onlineStatus?: string | boolean;
  userImage: string;
  profileImage?: any;
  selected?: boolean;
  defaultImage: any;
  lastMessageTime?: Date;
  peerId?: any;
  online?: any;
  followerCount?: number;
  followingCount?: number;
  email: any;
  role: any;
  userDescription: string;
  isFollower?: boolean;
  isFollowing?: boolean;
  lastMessageSent?: boolean;
  hasNewMessage: boolean;
  blocked: boolean;
  lastseen: Date

}

// chat.models.ts

export interface Message {
  id?: any;
  messageContent: string;
  time: Date;
  sent: boolean;
  senderId: number;
  receiverId: number;
  fileUrl: string | null;
  fileType: 'image' | 'video' | 'pdf' | 'other';
  temporary?: boolean;
  failed?: boolean;
  createdAt: Date;
  isNew?: boolean;
  sender: any;
  read: boolean;
  showToolbar: Boolean;
  deletedForSender?: boolean;
  deletedForReceiver?: boolean;
  reactions: any;
  myreaction:string;

}
export interface Group {
  id: number;
  name: string;
  image?: string;
  description?: string;
  info?: string;
  admin: number; // ID of the admin user
  members: number[];
}

export interface UserStatus {
  userId: number;
  online: boolean;
  lastSeen: Date;
}

export function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
export interface GroupMessages {
  id: number;
  name: string;
  adminId: number;
  memberIds: number[];
  messages: number[];
  lastMessage: any;
  lastMessageTime: Date;
  isGroup: boolean;
  description?: string;
  fileUrl: any;


}
export interface UserData {
  id: number;
  name: string;
  userImage?: string;
  onlineStatus?: boolean;
  email: string;
  role: string;
  userDescription?: string;
}
export interface ShortVideo {
  id: number;
  url: string;
  thumbnailUrl: string;
  uploadTime: Date;
  duration: string;
}



