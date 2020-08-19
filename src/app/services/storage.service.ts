import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from './user';
import { FILE_PATH, ORDER_PATH } from './path';
import { BehaviorSubject } from 'rxjs';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';
//tslint:disable

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private basePath = 'file';
  private draftPath = 'draft';
  subject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private angularFireStorage: AngularFireStorage, private angularFireDatabase: AngularFireDatabase) {

  }


  storageFile(user: User, projectNumber: any, order: any, file: File){
    const ref = this.angularFireStorage.ref(`${this.basePath}/${user.uId}/${order['id']}/${file.name}`);
    setTimeout(() => {
      ref.put(file)
        .then(() => {
          ref.getDownloadURL().subscribe(url => {
            this.angularFireDatabase.list(`${ORDER_PATH}/${user.uId}/${order['id']}/progetto/${projectNumber}/image`).push(url)
          });
        }
        )
        .catch(() => {
        });
    } , 500)

  }

  storageDraft(orderID: string, projectNumber: any, userID: string , files: File): Promise<any> {
    const ref = this.angularFireStorage.ref(`${this.draftPath}/${userID}/${orderID}/${files.name}`);
    return ref.put(files).then(()=>{
      ref.getDownloadURL().subscribe(url => {
        this.angularFireDatabase.database.ref(`${ORDER_PATH}/${userID}/${orderID}/draft/${projectNumber}/image`).update({img: url})
      })
    })
  }

  deleteFile(pathToFile, fileName) {
    const ref = this.angularFireStorage.storage.ref(pathToFile);
    const childRef = ref.child(fileName);
    childRef.delete()
  }

  //TODO riuscire a rimuovere un file dallo storage
  public removeOrderImg(userID: string, order: any){
    let imgRef = this.angularFireStorage.storage.ref(`${this.basePath}}/${userID}/${order}`)
    imgRef.listAll().then(dir => {
      dir.items.forEach(fileRef => {
        console.log(fileRef.name)
        this.deleteFile(imgRef.fullPath, fileRef.name);
      });
    });
  }
}
