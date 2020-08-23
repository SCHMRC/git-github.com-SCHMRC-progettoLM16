import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
//tslint:disable

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  msgError: any;
  show = false;
  email1 = ''
  password1 = ''

  constructor(private router: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit(form: object){
    this.authService.login(form['email'], form['password'])
    .then((userInfo) => {
      this.userService.getUser(userInfo.user.uid).subscribe(
        (data) => {
          this.userService.setSubject(data);
          this.userService.setAuthenticated(true);
          this.router.navigateByUrl('user');
        }
      )
    })
    .catch(
      (error) => {
        this.show = true;
        this.msgError = error}
    );


  }

  resetPassword(mioform: object) {
    this.authService.reset(mioform['emailModal'])
    .then(
      (msg) => {
        alert('Controlla la tua email e segui le istruzioni per impostare la nuova password')
      }
    )
    .catch(
      error => console.log(error)
    )


  }

  routing(){
    this.router.navigateByUrl('signin');
  }
}
