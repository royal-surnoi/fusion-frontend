import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FusionService } from '../fusion.service';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-followcount',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './followcount.component.html',
  styleUrl: './followcount.component.css'
})
export class FollowcountComponent implements OnInit{
 
  followerCount: number = 0;
  followingCount: number = 0;
  user:any;
  users$ = this.userService.users$;
  currentUser = this.userService.getCurrentUser();
  userId:number=1
  followRequests$ = this.userService.followRequests$;
 
  constructor(private fusionService: FusionService,private userService:UserService) { }
 
  // ngOnInit(): void {
   
     
  //   this.getFollowerCount(4);
  //   this.getFollowingCount(1);
  //   this.getUserDetails(4);
  //   this.userService.fetchUsers();
    
  // }
  ngOnInit(): void {
    this.getFollowerCount(this.currentUser.id);
    this.getFollowingCount(this.currentUser.id);
    this.getUserDetails(this.currentUser.id);
    this.userService.fetchUsers();
    this.userService.fetchFollowRequests(Number(this.currentUser.id)); // Fetch follow requests on component init
  }
  followUser(userId: number) {
    this.userService.followUser(userId);
  }

  // unfollowUser(userId: number) {
  //   this.userService.unfollowUser(userId);
  // }

  acceptFollowRequest(userId: number) {
    this.userService.acceptFollowRequest(userId);
  }

  ignoreFollowRequest(userId: number) {
    this.userService.ignoreFollowRequest(userId);
  }
  getFollowerCount(followerId: number): void {
    this.fusionService.getFollowerCount(followerId)
      .subscribe(count => this.followerCount = count);
  }
 
  getFollowingCount(followingId: number): void {
    this.fusionService.getFollowingCount(followingId)
      .subscribe(count => this.followingCount = count);
  }
  getUserDetails(userId: number): void {
    this.userService.getUserById(userId)
      .subscribe(user => {
        this.user = user;
        console.log('User details:', this.user);
        // Here you can update UI with user details if needed
      });
  }
  
 
}