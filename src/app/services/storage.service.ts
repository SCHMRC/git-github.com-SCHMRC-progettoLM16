import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from './user';
import { FILE_PATH, ORDER_PATH } from './path';
import { BehaviorSubject, Observable } from 'rxjs';
//tslint:disable

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private basePath = 'file';
  private draftPath = 'draft';
  subject: BehaviorSubject<any> = new BehaviorSubject(null);
  percentage: Observable<number>;
  imgUrl$: BehaviorSubject<string> = new BehaviorSubject(null);
  imgUrllist$: BehaviorSubject<string[][]> = new BehaviorSubject(null);

  constructor(private angularFireStorage: AngularFireStorage, private angularFireDatabase: AngularFireDatabase) {

  }


  /*storageFile(user: User, projectNumber: any, order: any, file: File){
    const ref = this.angularFireStorage.ref(`${this.basePath}/${user.uId}/${order['id']}/${file.name}`);

      ref.put(file)
        .then(() => {
          ref.getDownloadURL().subscribe(url => {
            this.angularFireDatabase.list(`${ORDER_PATH}/${user.uId}/${order['id']}/progetto/${projectNumber}/image`).push(url)
          });
        }
        )
        .catch(() => {
        });


  }*/

  getUrlImg(): BehaviorSubject<string> {
    return this.imgUrl$
  }

  setUrlImg(urlImg: string){
    this.imgUrl$.next(urlImg)
  }

  getUrlImglist(): BehaviorSubject<string[][]> {
    return this.imgUrllist$
  }

  setUrlImglist(urlImg: string[][]) {
    this.imgUrllist$.next(urlImg)
  }

  storageFile(user: User, projectNumber: any, order: any, file: File[]) {
    Object.entries(file).forEach(([key,file])=>{
      if(file !== undefined){
        const ref = this.angularFireStorage.storage.ref(`${this.basePath}/${user.uId}/${order['id']}/${projectNumber}/${file.name}`)
        const task: AngularFireUploadTask = this.angularFireStorage.upload(`${this.basePath}/${user.uId}/${order['id']}/${projectNumber}/${file.name}`, file)
        this.percentage = task.percentageChanges();
      }
    })

   /* const ref = this.angularFireStorage.ref(`${this.basePath}/${user.uId}/${order['id']}/${file.name}`);

    ref.put(file)
      .then(() => {
        ref.getDownloadURL().subscribe(url => {
          this.angularFireDatabase.list(`${ORDER_PATH}/${user.uId}/${order['id']}/progetto/${projectNumber}/image`).push(url)
        });
      }
      )
      .catch(() => {
      });*/


  }

  storageDraft(orderID: string, projectNumber: any, userID: string , files: File): Promise<any> {
    const ref = this.angularFireStorage.ref(`${this.draftPath}/${userID}/${orderID}/${files.name}`);
    return ref.put(files).then(() => {
      ref.getDownloadURL().subscribe(url => {
        this.angularFireDatabase.database.ref(`${ORDER_PATH}/${userID}/${orderID}/draft/${projectNumber}/image`).update(
          {
            accepted: false,
            img: url
          }
        )
      })
    })


  }


  removeImgFk(userId: string, orderId: string, projectNumber: string, filename: string): Promise<any> {
    return this.angularFireDatabase.database.ref(`order/${userId}/${orderId}/progetto/${projectNumber}/image/${filename}`).remove();

  }


  public removeOrderImg(userID: string, orderId: any, filename: string){
    let imgRef = this.angularFireStorage.storage.ref(`${this.basePath}/${userID}/${orderId}`).child(filename)
    imgRef.delete()
  }
}
