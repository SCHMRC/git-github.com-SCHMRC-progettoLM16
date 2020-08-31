import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GraphicService } from './graphic.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
  constructor(private userService: UserService, private graphicService: GraphicService){}
  canActivate(): boolean {
    return this.userService.getAuthenticated().getValue();
  }

}
