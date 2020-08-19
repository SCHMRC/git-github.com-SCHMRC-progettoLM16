import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Order } from 'src/app/services/order';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Lightbox } from 'ngx-lightbox';
import { GraphicService } from 'src/app/services/graphic.service';
import { ThemePalette } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';
//tslint:disable


@Component({
  selector: 'app-draft-work-list',
  templateUrl: './draft-work-list.component.html',
  styleUrls: ['./draft-work-list.component.scss']
})
export class DraftWorkListComponent implements OnInit {
  orders: any;
  orderID: any;
  result: any;
  user = this.userService.getSubject().getValue();
  userID = this.graphicService.getsubjectRappresentanteID();
  registrationForm: FormGroup;
  urlimg: Array<any> = [];
  show = false;
  checked: boolean;

/**/
  task: any = {
  name: 'Seleziona Tutto',
  completed: false,
  color: 'primary',
  subtasks: this.urlimg
}
  allComplete: boolean = false;
/**/

  @Output() dataOut = new EventEmitter()

  constructor(private graphicService: GraphicService, private lightbox: Lightbox, private orderService: OrderService, private userService: UserService) { }

  ngOnInit(): void {
    this.checked = false;
    if(this.user.utente == 'rappresentante'){
      this.orderService.getAllOrder(this.user.uId).then((snapshot) => {
        this.orders = snapshot.val();
        this.show = true;
      });
    }else {
      this.userID.subscribe((user) => {
        (user)? this.show = true : this.show = false
        this.orderService.getAllOrder(user).then((snapshot) => {
          this.orders = snapshot.val();
        });
      })
    }
  }

  onSubmit(){
    this.urlimg = []
    let param = '';
    (this.user.utente == 'rappresentante')?  param = this.user.uId :  param = this.userID.getValue()
    this.orderService.getOneDraft(param, this.orderID).then((snapshot) => {
      this.result = snapshot.val();
      Object.entries(this.result).forEach(([key,value])=>{
        Object.entries(value).forEach(([k,v])=>{
           let  album = {
              src: v['img'],
              caption: `identificativo della bozza: ${key}`,
              thumb: '',
              idproject: key,
              modifiche: v['modifiche'],
              orderId: this.orderID,
              name: 'Primary',
              color: 'primary',
              completed: v['accepted'],
          }
          if(!album.completed){
            this.urlimg.push(album)
          }

        })
      })
      let task: any = {
        name: 'Seleziona Tutto',
        completed: false,
        color: 'primary',
        subtasks: this.urlimg
      }
      this.task = task;
    });
    this.orderService.setIdImg(this.urlimg);
  }

  public getOrderID() {
    return this.registrationForm.get('orderID').value;
  }

  public accept(){
    Object.entries(this.task.subtasks).forEach(([key,value])=> {
      if (value['completed']){
        this.orderService.acceptSingleDraft(this.user.uId, this.orderID, value['idproject'])
        console.log(value)
      }
    })
  }

  public singleAccept(draftId: any[]){
    Object.entries(draftId).forEach(([key,value])=>{
      this.orderService.acceptSingleDraft(this.user.uId, this.orderID, value)
    })



  }

  open(index: number): void {
    // open lightbox
    this.lightbox.open(this.urlimg, index);
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

  modal(){
    this.dataOut.emit(true);
}


  someComplete(): boolean {
   if (this.task.subtasks === undefined) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll() {
    (this.checked == false) ? this.checked = true : this.checked = false;
    this.allComplete = this.checked;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = this.checked);
  }



}
