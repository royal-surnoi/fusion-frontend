import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(this.hasValidSession());
  private name = new BehaviorSubject<string | null>(null);
  private id = new BehaviorSubject<string | null>(null);
  private lastLoginTime = new BehaviorSubject<Date | null>(null);

  constructor() {
    if (this.isBrowser()) {
      const token = window.localStorage.getItem('token');
      const name = window.localStorage.getItem('name');
      const id = window.localStorage.getItem('id');
      const lastLoginTime = window.localStorage.getItem('lastLoginTime');

      if (token && name && id) {
        this.setLoggedIn(true);
        this.setName(name);
        this.setId(id);
        if (lastLoginTime) {
          this.setLastLoginTime(new Date(lastLoginTime));
        }
      }
    }
  }

  public isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  setLoggedIn(status: boolean): void {
    this.loggedIn.next(status);
    if (this.isBrowser()) {
      window.localStorage.setItem('loggedIn', JSON.stringify(status));
    }
  }

  isLogged(): boolean {
    return this.loggedIn.value;
  }

  getLoggedInObservable() {
    return this.loggedIn.asObservable();
  }

  setName(name: string | null): void {
    this.name.next(name);
    if (this.isBrowser() && name) {
      window.localStorage.setItem('name', name);
    }
  }

  getName(): string | null {
    return this.name.value;
  }

  getNameObservable() {
    return this.name.asObservable();
  }

  setId(id: string | null): void {
    this.id.next(id);
    if (this.isBrowser() && id) {
      window.localStorage.setItem('id', id);
    }
  }

  getId(): string | null {
    return this.id.value;
  }

  getIdObservable() {
    return this.id.asObservable();
  }

  login(token: string, name: string, id: string): void {
    this.setLoggedIn(true);
    this.setName(name);
    this.setId(id);
    const currentTime = new Date();
    this.setLastLoginTime(currentTime);
    if (this.isBrowser()) {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('name', name);
      window.localStorage.setItem('id', id);
      window.localStorage.setItem('lastLoginTime', currentTime.toISOString());
    }
  }

  logout(): void {
    this.setLoggedIn(false);
    this.setName(null);
    this.setId(null);
    this.setLastLoginTime(null);
    if (this.isBrowser()) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('name');
      window.localStorage.removeItem('id');
      window.localStorage.removeItem('loggedIn');
      window.localStorage.removeItem('lastLoginTime');
    }
  }

  setLastLoginTime(time: Date | null): void {
    this.lastLoginTime.next(time);
    if (this.isBrowser() && time) {
      window.localStorage.setItem('lastLoginTime', time.toISOString());
    }
  }

  getLastLoginTime(): Date | null {
    return this.lastLoginTime.value;
  }

  getLastLoginTimeObservable() {
    return this.lastLoginTime.asObservable();
  }

  initializeAuthState(): void {
    const isLoggedIn = this.hasValidSession();
    this.loggedIn.next(isLoggedIn);
  }

  isMainUserLoggedIn(): boolean {
    return this.loggedIn.value && localStorage.getItem('token') !== null;
  }

  private hasValidSession(): boolean {
    return !!localStorage.getItem('token');
  }

  getLoggedInUserId(): string | null {
    return this.getId();
  }
}
