import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {
  @Input() file: File;


  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  @Output() dataOut = new EventEmitter();



  constructor(private storage: AngularFireStorage, private angularFireDatabase: AngularFireDatabase,
              private userService: UserService, private storageService: StorageService) { }

  ngOnInit() {
    this.startUpload();
  }

  startUpload() {
    const user = this.userService.getSubject().getValue();
    const order = this.userService.getOrderId().getValue()



    // The storage path
    if (this.file !== undefined){
      const path = `file/${user.uId}/${order}/${this.file.name}`;

      // Reference to storage bucket
      const ref = this.storage.ref(path);

      // The main task
      this.task = this.storage.upload(path, this.file);

      // Progress monitoring
      this.percentage = this.task.percentageChanges();

      this.snapshot = this.task.snapshotChanges().pipe(
        tap(console.log),
        // The file's download URL
        finalize(async () => {
          this.downloadURL = await ref.getDownloadURL().toPromise();
          this.dataOut.emit(this.downloadURL);
        }),
      );
    }
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
