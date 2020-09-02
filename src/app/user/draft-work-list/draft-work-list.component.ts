import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  urlimg: Array<any> = [];
  show = false;
  checked: boolean;
  data:any
  nome: string;

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


  constructor( private graphicService: GraphicService, private lightbox: Lightbox, private orderService: OrderService, private userService: UserService) { }

  ngOnInit(): void {
    this.checked = false;
    this.orders = [];
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
    (this.user.utente == 'rappresentante') ? param = this.user.uId : param = this.graphicService.getsubjectRappresentanteID().getValue()
    this.orderService.getOneDraft(param, this.orderID).then((snapshot) => {
      this.result = snapshot.val();
      console.log(this.result)

        this.nome = this.result['nome']
      if (this.result['draft']) {
        Object.entries(this.result['draft']).forEach(([key, value]) => {
          Object.entries(value).forEach(([k,v])=>{
            let album = {
              src: v['img'],
              caption: `identificativo della bozza: ${key} `,
              thumb: '',
              idproject: key,
              modifiche: v['modifiche'],
              orderId: this.orderID,
              name: 'Primary',
              color: 'primary',
              completed: v['accepted'],
              keyImage: k
            }
            console.log(album)

              if (!album['completed']) {
                this.urlimg.push(album)
              }


          })

        })


        if (this.urlimg.length === 0) {
          this.show = false;
          return
        }

          let task = {
            name: 'Seleziona Tutto',
            color: 'primary',
            subtasks: this.urlimg
          }


        this.task = task;
        this.show = true
      }else{
        this.show = false

      }

    });
    this.orderService.setIdImg(this.urlimg);
  }

 /* onSubmit$(){
    this.urlimg = []
    let param = '';
    (this.user.utente == 'rappresentante') ? param = this.user.uId : param = this.graphicService.getsubjectRappresentanteID().getValue()
    this.orderService.$getOneDraft(param,this.orderID).subscribe((data)=>{
      this.result = data;
      this.nome = data['nome']
      if (this.result['draft']) {
        Object.entries(this.result['draft']).forEach(([key, value]) => {
          let album = {
            src: value['image']['img'],
            caption: `identificativo della bozza: ${key} `,
            thumb: '',
            idproject: key,
            modifiche: value['image']['modifiche'],
            orderId: this.orderID,
            name: 'Primary',
            color: 'primary',
            completed: value['image']['accepted'],
          }
          if (this.graphicService.getSubject().getValue()) {
            if (album['completed']) {
              this.urlimg.push(album)
            }
          } else {
            if (!album['completed']) {
              this.urlimg.push(album)
            }
          }
        })

        if (this.urlimg.length === 0) {
          this.show = false;
          return
        }
        let task: any = {
          name: 'Seleziona Tutto',
          color: 'primary',
          subtasks: this.urlimg
        }
        this.task = task;
        this.show = true
      } else {
        this.show = false

      }
    })
  }*/


  public accept(){
    let param;
    (this.user.utente == 'rappresentante') ? param = this.user.uId : param = this.graphicService.getsubjectRappresentanteID().getValue()
    Object.entries(this.task.subtasks).forEach(([key,value])=> {
      if (value['completed']){
        this.orderService.acceptSingleDraft(param, this.orderID, value['idproject'], value['keyImage'])
        console.log(value)
      }
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

  removeDraft() {
    let rappId = this.userID.getValue();
    console.log(this.urlimg);
    Object.entries(this.urlimg).forEach(([key,value])=>{
      if(value['completed']){
        this.orderService.removeSingleDraft(rappId, this.orderID, value['idproject']).then(() => { console.log('ok') })
      }
    })
   /* Object.entries(this.task.subtasks).forEach(([key, value]) => {
      this.orderService.removeSingleDraft(rappId, this.orderID, value['idproject']).then(()=>{console.log('ok')})
    })*/
  }








}
