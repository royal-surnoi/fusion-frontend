import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChipModule } from 'primeng/chip';
import { FormsModule } from '@angular/forms';
import { Observable, catchError, forkJoin, map, mergeMap, of } from 'rxjs';

interface Person {
  id: number;
  name: string;
  email: string;
  username: string;
  isActive: boolean;
  isLoading: boolean;
  isVisible: boolean;
}

@Component({
  selector: 'app-studentdashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ChipModule, FormsModule],
  templateUrl: './studentdashboard.component.html',
  styleUrls: ['./studentdashboard.component.css']
})
export class StudentdashboardComponent implements OnInit {
  mentorList: Person[] = [];
  filteredMentorList: Person[] = [];
  searchText = '';
  userId: string | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('id');
    if (this.userId) {
      this.getMentorsListToFollow();
      this.getSuggestedUserDetails(this.userId);
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  filterMentors(): void {
    this.filteredMentorList = this.searchText
      ? this.mentorList.filter(mentor =>
          mentor.isVisible &&
          (mentor.username.toLowerCase().includes(this.searchText.toLowerCase()) ||
           mentor.name.toLowerCase().includes(this.searchText.toLowerCase()))
        )
      : this.mentorList.filter(mentor => mentor.isVisible);
  }

  sanitizeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  togglePerson(person: Person): void {
    if (person.isLoading) return;

    person.isLoading = true;
    person.isActive = !person.isActive;

    if (person.isActive) {
      this.loadPersonData(person);
    } else {
      this.unloadPersonData(person);
    }
  }

  sendingFollowRequest(event: Event, personId: number): void {
    event.stopPropagation();

    if (!this.userId) {
      console.error('User ID not found in localStorage');
      alert('User ID not found. Please log in again.');
      return;
    }

    const userIdNumber = Number(this.userId);
    if (isNaN(userIdNumber)) {
      console.error('Invalid user ID in localStorage');
      alert('Invalid user ID. Please log in again.');
      return;
    }

    this.http.post(`${environment.apiBaseUrl}/follow/saveByIds?followerId=${userIdNumber}&followingId=${personId}`, {})
      .subscribe({
        next: (res: any) => {
          const person = this.mentorList.find(p => p.id === personId);
          if (person) {
            person.isActive = true;
            person.isLoading = false;
            person.isVisible = false;
          }
          this.filterMentors();
          alert('Follow request sent successfully!');
        },
        error: (error) => {
          console.error('Error sending follow request', error);
          alert('Error sending follow request. Please try again.');
          const person = this.mentorList.find(p => p.id === personId);
          if (person) {
            person.isLoading = false;
          }
        }
      });
  }

  private loadPersonData(person: Person): void {
    setTimeout(() => {
      person.isLoading = false;
      this.filterMentors();
    }, 1000);
  }

  private unloadPersonData(person: Person): void {
    setTimeout(() => {
      person.isLoading = false;
      this.filterMentors();
    }, 10);
  }

  private getFollowingIds(): Observable<number[]> {
    return this.userId
      ? this.http.get<number[]>(`${environment.apiBaseUrl}/follow/findFollowingIdsByFollowerId/${this.userId}`)
      : of([]);
  }

  private getMentorsListToFollow(): void {
    const userData = { user_id: 1 };

    forkJoin({
      userDetails: this.http.post<any[]>(`${environment.apiBaseUrl}/mentorSuggestions`, userData).pipe(
        mergeMap(res => forkJoin(res.map(id => this.http.get<any>(`${environment.apiBaseUrl}/user/find/${id}`))))
      ),
      followingIds: this.getFollowingIds()
    }).subscribe({
      next: ({ userDetails, followingIds }) => {
        this.mentorList = userDetails.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.email.split('@')[0],
          isActive: followingIds.includes(user.id),
          isLoading: false,
          isVisible: !followingIds.includes(user.id)
        }));
        this.filterMentors();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  private getSuggestedUserDetails(userId: string): void {
    const userData = { user_id: userId };
    
    this.http.post<any[]>(`${environment.apiBaseUrl}/mentorSuggestions`, userData)
      .subscribe({
        next: (res) => {
          console.log('Mentor suggestions:', res);
        },
        error: (error) => {
          console.error('Error fetching mentor suggestions:', error);
        }
      });
  }
}