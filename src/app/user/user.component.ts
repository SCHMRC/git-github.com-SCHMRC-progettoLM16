import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderService } from '../services/order.service';
import { User } from '../services/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  template: `
  <!-- Modal -->
<div *ngIf="show" class="modal fade" id="modifica" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modifiche da apportare</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form #modalform="ngForm" (ngSubmit)="onSubmit(modalform.value)">
      <div class="modal-body">
<select class="custom-select" (ngModel)="selectedIdT" #selectedIdT="ngModel" name="selectedIdT">
  <option selected>Open this select menu</option>
  <option *ngFor="let img of listIdImg" value="{{img.caption}},{{img.idproject}},{{img.orderId}}">identificativo bozza: {{img.idproject}}
  </option>

</select>
        <div class="form-group">
            <label for="message-text" class="col-form-label">Messaggio:</label>
            <textarea class="form-control" id="message-text" name="message" (ngModel)="message" #message="ngModel"></textarea>
          </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>
        <button type="submit" class="btn btn-primary">Invia messaggio</button>
      </div>
      </form>
    </div>
  </div>
</div>
    <mat-tab-group animationDuration="0ms"  mat-align-tabs="center">
      <mat-tab label="Rappresentanti" *ngIf="user.utente == 'grafico'"><app-graphic></app-graphic></mat-tab>
      <mat-tab label="Inserisci Ordine" *ngIf="user.utente !== 'grafico'"><app-insert-work></app-insert-work></mat-tab>
      <mat-tab label="Ordini in lavorazione"><app-work-list></app-work-list></mat-tab>
      <mat-tab label="Aggiungi Bozze Progetti" *ngIf="user.utente == 'grafico'"><app-draft-work></app-draft-work></mat-tab>
      <mat-tab label="Visualizza Bozze"><app-draft-work-list (dataOut)="setOut($event)"></app-draft-work-list></mat-tab>
      <mat-tab label="Ordini confermati"></mat-tab>
  </mat-tab-group>
  `,
  styles: [
  ]
})
export class UserComponent implements OnInit {
  user: User;
  show: boolean;
  listIdImg: any[] = [];

  constructor(private userService: UserService, private orderService: OrderService) { }

  ngOnInit(): void {


    this.userService.getSubject().subscribe(
      (user) => this.user = user
    );

  }

  setOut(parametro: boolean) {
    this.show = parametro;
    this.orderService.getIdImg().subscribe((data) => {
      this.listIdImg = data;
    });
  }

  onSubmit(modalform: object){
    const user = this.userService.getSubject().getValue();
    const selected: string = modalform['selectedIdT'];
    const word = selected.split(',');
    this.orderService.chageDraft(user.uId, word[2]  , word[1], word[0], modalform['message']).then(
      () => {});
  }
}
