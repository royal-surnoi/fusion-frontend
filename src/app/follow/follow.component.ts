
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';


@Component({
  selector: 'app-follow',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})

export class FollowComponent implements OnInit{
  users$ = this.userService.users$;

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  acceptFollowRequest(userId: number) {
    this.userService.acceptFollowRequest(userId);
  }

  ignoreFollowRequest(userId: number) {
    this.userService.ignoreFollowRequest(userId);
  }
  
}

