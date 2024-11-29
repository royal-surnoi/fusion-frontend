
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  users$ = this.userService.users$;
  currentUser = this.userService.getCurrentUser();
  userId:number=1
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    // Users are fetched in the service constructor, so no need to fetch them here
    this.userService.fetchUsers();
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
}

