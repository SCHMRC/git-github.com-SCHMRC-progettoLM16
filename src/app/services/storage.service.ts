import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from './user';
import { FILE_PATH, ORDER_PATH } from './path';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
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
  snapshot: Observable<any>;
  downloadURL: string;
  task: AngularFireUploadTask;

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

  storageFile(user: string, projectNumber: any, order: string, file: File[]) {
    Object.entries(file).forEach(([key,file])=>{
      if(file !== undefined){
        const path = `${this.basePath }/${user}/${order}/${file.name}`;

        // Reference to storage bucket
        const ref = this.angularFireStorage.ref(path);
        ref.put(file)
        .then(() => {
          ref.getDownloadURL().subscribe(url => {
            this.angularFireDatabase.database.ref(`${ORDER_PATH}/${user}/${order}/progetto/${projectNumber}/image`).push(url)
          })

        })
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


  public removeOrderImg(userID: string, orderId: any, filename: string): Promise<any>{
    let imgRef = this.angularFireStorage.storage.ref(`${this.basePath}/${userID}/${orderId}/${filename}`)
    return imgRef.delete()
  }

  /*TODO: implementare la funzione di aggiornamento immagine*/
  public update(userId: string,orderId,projectNumber,newFile){
    this.storageFile(userId, projectNumber, orderId, newFile)
  }
}
