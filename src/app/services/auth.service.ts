import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth) { }


  public addAuth(email: string, password: string): Promise<any>{
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  public login(email: string, password: string): Promise<any>{
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  public reset(email: any): Promise<any>{
    return this.angularFireAuth.sendPasswordResetEmail(email);
  }

  public exit(): Promise<any> {
    return this.angularFireAuth.signOut();
  }
  public current(): Promise<firebase.User>{
    return this.angularFireAuth.currentUser;
  }
}
