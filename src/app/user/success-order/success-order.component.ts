import { Component, OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { GraphicService } from 'src/app/services/graphic.service';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';
//tslint:disable

@Component({
  selector: 'app-success-order',
  templateUrl: './success-order.component.html',
  styleUrls: ['./success-order.component.scss']
})
export class SuccessOrderComponent implements OnInit {
  checked: boolean;
  user = this.userService.getSubject().getValue();
  userID = this.graphicService.getsubjectRappresentanteID();
  orders: any;
  result: any;
  show = false;
  urlimg: Array<any> = [];
  orderID: any;


  task: any = {
    name: 'Seleziona Tutto',
    completed: false,
    color: 'primary',
    subtasks: this.urlimg
  }

  constructor(private graphicService: GraphicService, private lightbox: Lightbox, private orderService: OrderService, private userService: UserService) { }

  ngOnInit(): void {
    this.checked = false;
    if (this.user.utente == 'rappresentante') {
      this.orderService.getAllOrder(this.user.uId).then((snapshot) => {
        this.orders = snapshot.val();
        this.show = true;
      });
    } else {
      this.userID.subscribe((user) => {
        (user) ? this.show = true : this.show = false
        this.orderService.getAllOrder(user).then((snapshot) => {
          this.orders = snapshot.val();
        });
      })
    }
  }

  onSubmit() {
    this.urlimg = []
    let param = '';
    (this.user.utente == 'rappresentante') ? param = this.user.uId : param = this.graphicService.getsubjectRappresentanteID().getValue()
    console.log(param)
    this.orderService.getOneDraft(param, this.orderID).then((snapshot) => {
      this.result = snapshot.val();

      Object.entries(this.result).forEach(([key, value]) => {
        Object.entries(value).forEach(([k, v]) => {
          let album = {
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
          if (album['completed']) {
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
    }).catch(error => {console.log(error)});
    this.orderService.setIdImg(this.urlimg);
  }

  open(index: number): void {
    // open lightbox
    this.lightbox.open(this.urlimg, index);
  }

  close(): void {
    // close lightbox programmatically
    this.lightbox.close();
  }

}
