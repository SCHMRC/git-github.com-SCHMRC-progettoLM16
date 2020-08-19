import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Order } from 'src/app/services/order';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Lightbox } from 'ngx-lightbox';
import { GraphicService } from 'src/app/services/graphic.service';
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
  @Output() dataOut = new EventEmitter()

  constructor(private graphicService: GraphicService, private lightbox: Lightbox, private orderService: OrderService, private userService: UserService) { }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      orderID: new FormControl('')
    });
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
    this.orderService.getOneDraft(param, this.getOrderID()).then((snapshot) => {
      this.result = snapshot.val();
      Object.entries(this.result).forEach(([key,value])=>{
        Object.entries(value).forEach(([k,v])=>{
            const album = {
              src: v['img'],
              caption: `
                    identificativo della bozza: ${key}`,
              thumb: '',
              idproject: key,
              modifiche: v['modifiche'],
              orderId: this.getOrderID()
           };
            this.urlimg.push(album)
            console.log(this.urlimg.length)
        })

      })
    });
    this.orderService.setIdImg(this.urlimg);
  }

  public getOrderID() {
    return this.registrationForm.get('orderID').value;
  }

  public accept(){
    this.orderService.acceptDraft(this.user.uId,this.getOrderID())
    .then(()=>{console.log('ok')})
    .catch((error)=>{console.log(error)})

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



}
