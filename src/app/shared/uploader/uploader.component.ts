import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as id from 'shortid';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  isHovering: boolean;

  files: File[] = [];
  order: string;
  urlImg: string;
  @Output() dataOut = new EventEmitter();
  @Input() dataIn: boolean;
  test: string[] = []
  stringa: string;
  matrix: string[][] = [];


  constructor(private userService: UserService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getReset$().subscribe(value =>{
      if (value) {
        this.test = [];
        this.files = [];
        this.orderService.setReset$(false);
      }
    })


  }


  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  setImg(event){
    this.stringa = event;
    this.test.push(this.stringa);
    this.dataOut.emit(this.test);
    }

}
