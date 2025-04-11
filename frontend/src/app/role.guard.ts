import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
    const router = inject(Router);
  
    const userRoles = authService.getUserRoles(); 
    const allowedRoles = route.data['roles'] as string[]; 
    console.log("\n allowedRoles", allowedRoles, "connected:", userRoles)

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }
  
    const hasAccess = allowedRoles.some(role => userRoles.includes(role));
  
    if (!hasAccess) {
      router.navigate(['/login']); 
    }
  
    return hasAccess;
};
