import { Injectable } from '@angular/core';
import { AngularFireDatabase  } from '@angular/fire/database';

import { PATH } from './path';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class GraphicService {
  subject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  subjectRappresentanteID: BehaviorSubject<string> = new BehaviorSubject(null)

  constructor(private angularFireDatabase: AngularFireDatabase) { }

  public getAllUser(){
    return this.angularFireDatabase.object<any>(`${PATH}`).valueChanges();
  }

  public setsubjectRappresentanteID(rapprID: string){
    this.subjectRappresentanteID.next(rapprID);
  }

  public getsubjectRappresentanteID() {
    return this.subjectRappresentanteID;
  }

  public completesubjectRappresentanteID(): boolean{
    this.subjectRappresentanteID.complete();
    this.subjectRappresentanteID.unsubscribe();
    this.subjectRappresentanteID = new BehaviorSubject(null);
    return  this.subjectRappresentanteID.closed;
  }

  temp() {

  }

  setSubject(param: boolean){
    this.subject.next(param);
  }

  getSubject(){
    return this.subject;
  }
}
