import { Component, OnInit } from '@angular/core';
import { GraphicService } from 'src/app/services/graphic.service';
import { Order } from 'src/app/services/order';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastrService } from 'ngx-toastr';

//tslint:disable
@Component({
  selector: 'app-draft-work',
  templateUrl: './draft-work.component.html',
  styleUrls: ['./draft-work.component.scss']
})
export class DraftWorkComponent implements OnInit {
  dragDropConfig = {
    showList: true,
    showProgress: true
  };
  orderIDList: Order[] = [];
  projectList: any;;
  selected = '';
  pid: number;
  userId: string;
  files: File[] = [];
  test: any[] =[]

  constructor(private storageService: StorageService, private orderService: OrderService, private graphicService: GraphicService, private toastService: ToastrService) {

  }

  ngOnInit(): void {
      this.graphicService.getsubjectRappresentanteID().subscribe(
        (rappresentanteId) => {

          this.orderService.getAllOrder(rappresentanteId).then((snapshot) =>{
            this.projectList = snapshot.val()
          })
        })

  }

  getUploadedFiles(files) {
    this.files = files
  }

  onSubmit(form: object){
    this.graphicService.getsubjectRappresentanteID().subscribe((rappresentanteId)=>{
      this.userId = rappresentanteId;
      this.files.forEach(element => {
        this.storageService.storageDraft(form['orderId'], form['projectId'], this.userId, element).then(() =>{
          this.toastService.success('Hello world!', 'Toastr fun!')
        }
        )
      })


    })


  }

}
