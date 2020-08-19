import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
//tslint:disable

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  msgError: any;
  showError = false;
  user: string;


  constructor(private authService: AuthService, private userService: UserService,private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: object) {
    this.authService.addAuth(form['email'], form['password'])
      .then((userInfo) => {
        const user = new User(form['name'], form['email'], form['mobile'], form['utente'], userInfo.user.uid, form['graficoEmail']);
        this.userService.addUser(user).then(
          () => {
            this.userService.setSubject(user)

            if(user.utente == 'grafico'){
              this.userService.setGraphic(true)
            }else if (user.utente == 'rappresentante'){
              this.userService.setAuthenticated(true)
            }
            this.router.navigateByUrl('user')
          }
        )
      }
      )
      .catch((error) => {
        this.msgError = error;
        this.showError = true;

      }
      );

  }

}
