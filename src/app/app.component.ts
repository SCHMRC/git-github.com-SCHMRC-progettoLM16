import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  show = false;

  constructor(private storageService: StorageService, private userService: UserService, private authService: AuthService, private router: Router) {}

  ngOnInit(){
    this.userService.getAuthenticated().subscribe(
      (value) => this.show = value
    );

  }


  exit() {
    this.authService.exit().then(
      () => {
        this.storageService.setUrlImglist(null);
        this.userService.setSubject(null);
        this.userService.setAuthenticated(false);
        this.router.navigateByUrl('home');
      }
    );
  }


}
