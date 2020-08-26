import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Order } from './order';
import { ORDER_PATH, PATH } from './path';
import { User } from './user';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { map } from 'rxjs/operators';

// tslint:disable

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  list: any[] = [];
  order: Order[] = [];
  listIdImg: BehaviorSubject<any[]> = new BehaviorSubject(null);
  reset: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private angularFireDatabase: AngularFireDatabase, private userService: UserService, private storageStorage: StorageService) { }



  insertOrder(user: User, order: Order): Promise<any> {

    return this.angularFireDatabase.object<any>(`${ORDER_PATH}/${user.uId}/${order.oid}`).set(order);


  }

  public getAllOrder$(uid: string): Observable<any[]> {
    return this.angularFireDatabase.object<any[]>(`${ORDER_PATH}/${uid}`).valueChanges()
  }
/**/


  public getAllOrder(uid: string){
    return this.angularFireDatabase.database.ref(`${ORDER_PATH}/${uid}`).once('value')
  }

  public getAllProjectSnap(uid: string): Promise<any> {
   return this.angularFireDatabase.database.ref(`${ORDER_PATH}/${uid}`).once("value")
  }

  public getOneDraft(userID: string, orderID: string): Promise<any> {
    return this.angularFireDatabase.database.ref(`${ORDER_PATH}/${userID}/${orderID}/`).once('value')
  }

  public getIdImg(): BehaviorSubject<any[]>{
    return this.listIdImg;
  }

  public setIdImg(listIdImg: any[]) {
    this.listIdImg.next(listIdImg);
  }

  public setReset$(param: boolean){
    this.reset.next(param)
  }

  public getReset$(): BehaviorSubject<boolean> {
    return this.reset;
  }


  public control(userId: string) {

    let flag = 0;
    this.angularFireDatabase.database.ref(`${ORDER_PATH}/${userId}`).once('value', (snapshot) => {
      snapshot.forEach(element => {
        flag = 0;
        let childData = element.key;
        this.angularFireDatabase.database.ref(`${PATH}/${userId}/idProjectFK`).once('value', (snapshot) => {
          snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.val();
            if (childData == childKey) {
              flag = 1;

            }
          });
        });
        if (flag == 0) {
          this.angularFireDatabase.database.ref(`${ORDER_PATH}/${userId}/${childData}`).remove()
        }
      })


    })

  }


  public removeOrder(orderId: string, orderIdKey: string, userID: string): Promise<void> {
    this.angularFireDatabase.database.ref(`${ORDER_PATH}/${userID}/${orderId}`).remove()
    //this.storageStorage.removeOrderImg(userID, orderId)
    return this.angularFireDatabase.database.ref(`${PATH}/${userID}/idProjectFK/${orderIdKey}`).remove()




  }

  public removeProject(orderId: string, indexProject: number): Promise<any> {
    const user = this.userService.getSubject().getValue()
    console.log(`${ORDER_PATH}/${user.uId}/${orderId}/progetto/${indexProject}`);
    return this.angularFireDatabase.database.ref(`${ORDER_PATH}/${user.uId}/${orderId}/progetto/${indexProject}`).remove()

  }

  public acceptAllDraft(userID: string, orderID: string): Promise<any>{
    const ref = this.angularFireDatabase.database.ref(`${ORDER_PATH}/${userID}/${orderID}`)
    return ref.update({accepted: true})
  }

  public acceptSingleDraft(userID: string, orderID: string, projectId: string): Promise<any> {
    const ref = this.angularFireDatabase.database.ref(`${ORDER_PATH}/${userID}/${orderID}/draft/${projectId}/image`)
    return ref.update({ accepted: true })
  }

  public removeSingleDraft(userID: string, orderID: string, projectId: string): Promise<any> {
    const ref = this.angularFireDatabase.database.ref(`${ORDER_PATH}/${userID}/${orderID}/draft/${projectId}`)
    return ref.remove();
  }

  public chageDraft(userID: string, orderID: string, projectNumber: any,imgId: any,modalform: string): Promise<any>{
    return this.angularFireDatabase.database.ref(`${ORDER_PATH}/${userID}/${orderID}/draft/${projectNumber}/image`).update({modifiche: modalform})

  }
}

