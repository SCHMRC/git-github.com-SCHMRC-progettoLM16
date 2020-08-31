import { Component, OnInit } from '@angular/core';
import { GraphicService } from 'src/app/services/graphic.service';
import { Order } from 'src/app/services/order';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/services/project';
import { analytics } from 'firebase';

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
  projectIdList: any[] = [];
  orderList: any;
  projectList: any[][] = [];
  selectedOrderId = '';
  pid: number;
  userId: string;
  idProject: string;
  files: File[] = [];
  test: any[] =[];


  constructor(private storageService: StorageService, private orderService: OrderService, private graphicService: GraphicService, private toastService: ToastrService) {

  }

  ngOnInit(): void {

      this.graphicService.getsubjectRappresentanteID().subscribe(
        (rappresentanteId) => {
          this.orderService.getAllOrder(rappresentanteId).then((snapshot) =>{
            this.orderList = snapshot.val()
          })
        })



  }

  getUploadedFiles(files) {
    this.files = files
  }

  onChange(){
    this.projectList = []
    this.projectIdList = []
    this.graphicService.getsubjectRappresentanteID().subscribe(
      (rappresentanteId) => {
        this.orderService.getAllOrder(rappresentanteId).then((snapshot) => {
          let orderList = snapshot.val()
          Object.entries(orderList).forEach(([key,value])=>{
            if (key == this.selectedOrderId){
              this.projectList.push(value['progetto'])
            }
          })
          Object.entries(this.projectList).forEach(([key,value])=>{
            Object.entries(value).forEach(([key, value]) => {
              this.projectIdList.push(value['projectNumber'])

            })
          })
        })
      }).unsubscribe()

  }

  onSubmit(form: object){
    new Promise<any>((resolve,reject)=>{
      this.graphicService.getsubjectRappresentanteID().subscribe((rappresentanteId) => {
        this.userId = rappresentanteId;
        this.files.forEach(element => {
          this.storageService.storageDraft(this.selectedOrderId, this.idProject, this.userId, element)
        })
        resolve(this.toastService.success('bozza inserita correttamente'));
      }).unsubscribe()
    }
    ).catch((error)=>{
      this.toastService.error(`Qualcosa è andato storto:${error}`);
    })
  }



}
