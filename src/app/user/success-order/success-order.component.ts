import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { GraphicService } from 'src/app/services/graphic.service';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';
import { Project } from 'src/app/services/project';
//tslint:disable

@Component({
  selector: 'app-success-order',
  templateUrl: './success-order.component.html',
  styleUrls: ['./success-order.component.scss']
})
export class SuccessOrderComponent implements OnInit {
  orderID: any;
  urlimg: Array<any> = [];
  checked: boolean;
  orders: any;
  user = this.userService.getSubject().getValue();
  userID = this.graphicService.getsubjectRappresentanteID();
  show = false;
  progetti: Project[] = [];
  nome: string;
  result: any;
  task: any = {
    name: 'Seleziona Tutto',
    completed: false,
    color: 'primary',
    subtasks: this.urlimg
  }


  constructor(private router: Router,private graphicService: GraphicService, private lightbox: Lightbox, private orderService: OrderService, private userService: UserService) { }

  ngOnInit(): void {
    this.checked = false;
    this.orders = [];
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
    this.progetti = []
    let param = '';
    (this.user.utente == 'rappresentante') ? param = this.user.uId : param = this.graphicService.getsubjectRappresentanteID().getValue()
    this.orderService.getOneDraft(param, this.orderID).then((snapshot) => {
      this.result = snapshot.val();


      this.nome = this.result['nome']
      Object.entries(this.result['progetto']).forEach(([key, value]) => {
        let progetto: Project = {
          luminosa: value['luminosa'],
          palo: value['palo'],
          forma: value['forma'],
          materiale: value['materiale'],
          spessore: value['spessore'],
          laminazione: value['laminazione'],
          calpestabile: value['calpestabile'],
          colore: value['colore'],
          opalino: value['opalino'],
          pieghe: value['pieghe'],
          occhielli: value['occhielli'],
          base: value['base'],
          altezza: value['altezza'],
          lato: value['lato'],
          diametro: value['diametro'],
          copie: value['copie'],
          bifacciale: value['bifacciale'],
        }
        this.progetti.push(progetto)
      })

      if (this.result['draft']) {
        Object.entries(this.result['draft']).forEach(([key, value]) => {
          Object.entries(value).forEach(([k, v]) => {
            let album: object;
            if (v['accepted']){
              album = {
                src: v['img'],
                caption: `identificativo della bozza: ${key} `,
                thumb: '',
                idproject: key,
                modifiche: v['modifiche'],
                orderId: this.orderID,
                name: 'Primary',
                color: 'primary',
                completed: v['accepted'],
              }
              this.urlimg.push(album)
            }
          })

        })


        if (this.urlimg.length === 0) {
          this.show = false;
          return
        }
        console.log(this.urlimg)

        let task = {
          name: 'Seleziona Tutto',
          color: 'primary',
          subtasks: this.urlimg
        }


        this.task = task;
        this.show = true
      } else {
        this.show = false

      }

    });
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

  completed() {
    const userId = this.graphicService.getsubjectRappresentanteID().getValue()
    this.orderService.setCompletedOrder(userId, this.orderID);

  }

  external() {
    const userId = this.graphicService.getsubjectRappresentanteID().getValue()
    this.orderService.setExternalOrder(userId, this.orderID);
  }

  weTransfer() {
    this.router.navigateByUrl('https://wetransfer.com')
  }

}

