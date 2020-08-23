import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { PATH, FILE_PATH, ORDER_PATH } from './../services/path';
import { User } from './user';
//tslint:disable

@Injectable({
  providedIn: 'root'
})
export class UserService {

  graphic: BehaviorSubject<boolean> = new BehaviorSubject(false)
  subject: BehaviorSubject<User> = new BehaviorSubject(null);
  authenticated: BehaviorSubject<boolean> = new BehaviorSubject(null);
  project: BehaviorSubject<any> = new BehaviorSubject(null);
  orderId: BehaviorSubject<string> = new BehaviorSubject(null);
  constructor(private angularFireDatabase: AngularFireDatabase) { }


  public addUser(user: User): Promise<any>{
    return this.angularFireDatabase.object(`${PATH}/${user.uId}`).set(user);
  }

  public getUser(uid: string): Observable<any>{
    return this.angularFireDatabase.object(`${PATH}/${uid}`).valueChanges();
  }

  public getOrderId(): BehaviorSubject<string> {
    return this.orderId;
  }

  public setOrderId(orderId: string){
    this.orderId.next(orderId);
  }






  public setProject(param: any){
    this.project.next(param);
  }

  public getProject() {
    return this.project;
  }

  public setSubject(user: User){
    this.subject.next(user);
  }

  public getGraphic(): BehaviorSubject<boolean> {
    return this.graphic
  }

  public setGraphic(bool: boolean) {
    this.graphic.next(true)

  }

  public getSubject(): BehaviorSubject<User>{
    return this.subject;
  }

  public setAuthenticated(value: boolean){
    this.authenticated.next(value);
  }

  public getAuthenticated(): BehaviorSubject<boolean>{
    return this.authenticated;
  }

  public userListProject(userId: string): Observable<any[]> {
    return this.angularFireDatabase.list<any[]>(`${PATH}/${userId}/idProjectFK`).valueChanges()

  }

  public updateListOrder(order: any){
    const user = this.getSubject().getValue();
    let idProjectFKList: any;
    //metodo equivalente al sottostante -> this.angularFireDatabase.list<any>(`${PATH}/${user.uId}/idProjectFK`).push(order.id)
    this.angularFireDatabase.database.ref(`${PATH}/${user.uId}/idProjectFK`).push(order.id)
  }

  public getFile(user: User, project: any): Observable<any[]> {
    return this.angularFireDatabase.list<any[]>(`${FILE_PATH}/${user.uId}/${project['nome']}`).valueChanges();

  }

  public getListImage(user: User, orderId: any,projectNumber: number): Observable<any[]> {
    return this.angularFireDatabase.list<any[]>(`${ORDER_PATH}/${user.uId}/${orderId}/progetto/${projectNumber}/image`).valueChanges()
  }

  public getListIdProjectFK(userID: string): Promise<any>{
    return this.angularFireDatabase.database.ref(`${PATH}/${userID}/idProjectFK/`).once('value')
  }


  public removeIdProjectFK(user: User, idProjectFK: string) {
    this.angularFireDatabase.object<any>(`${PATH}/${user.uId}/idProjectFK/${idProjectFK}`)
  }
}
