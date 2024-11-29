import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

// Define the authGuard function
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get authentication status from localStorage (whether user is logged in)
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const currentUrl = state.url;

  // Check if token is available in localStorage (for session persistence)
  const token = localStorage.getItem('token');

  if (isLoggedIn && token) {
    // If user is logged in, define allowed routes (e.g., feed page)
    const allowedRoutes = ['/feed'];

    // If the current URL is in the allowed routes, permit access
    if (allowedRoutes.includes(currentUrl)) {
      return true;
    } else {
      // If it's a page reload, allow staying on the current page
      if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        return true;
      } else {
        // For any other route, redirect to the feed page
        return router.navigate(['/feed']);
      }
    }
  } else {
    // If user is not logged in or token is missing, redirect to the login page
    return router.navigate(['/login']);
  }
};
