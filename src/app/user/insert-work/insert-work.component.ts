import { Component, OnInit, NgZone, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
import { TIPO, SPESSORE } from './../../services/material-list';
import { take } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import * as Rx from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import {Project} from './../../services/project';
import { Order } from 'src/app/services/order';
//tslint:disable

@Component({
  selector: 'app-insert-work',
  templateUrl: './insert-work.component.html',
  styleUrls: ['./insert-work.component.scss']
})
export class InsertWorkComponent implements OnInit {
  dragDropConfig = {
    showList: true,
    showProgress: true
  };
  isEditable = false;
  erroMsg: any;
  tipo: string[] = [];
  spessore: number[] = [];
  project: Project[] = [];
  user: User;
  order: Order;
  subject: Rx.BehaviorSubject<any> = new Rx.BehaviorSubject(null);
  showModal: Rx.BehaviorSubject<boolean> = new Rx.BehaviorSubject(false);
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  key: number;
  forma: any[] = [];
  miostile: Object;
  imageUrl: string[][] = [];
  reset: boolean = false;



  formGroup: FormGroup;
  formList: FormGroup[] = [];
  pezzi = 1;


  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private orderService: OrderService,
    private _ngZone: NgZone,
    private toastr: ToastrService) {
    this.tipo = TIPO;
    this.spessore = SPESSORE;
    this.miostile = {
      width: '200px',
      height: '200px',
      border: 'solid 1px black',
    }


  }

  ngOnInit(): void {


    this.forma = [
      'Quadrato',
      'Ovale',
      'Cerchio',
      'Sagomato'
    ]

    this.subject.next(this.setLista(this.pezzi))
    this.subject.subscribe((data) => {
      this.formList = data
    })

    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          nome: ['', Validators.required]
        }),
        this.formBuilder.group({
          elementi_progetto: [1, [Validators.required, Validators.min(1), Validators.max(15)]]
        }),
      ])
    });
    this.order = new Order(
      moment().format('lll'),
      this.userService.getOrderId().getValue(),
      this.formGroup['value']['formArray'][0]['nome'],
      this.formGroup['value']['formArray'][1]['elementi_progetto'],
      this.project
    )

    /*this.order =
    {
      nome: this.formGroup['value']['formArray'][0]['nome'],
      data: moment().format('LLL'),
      pezzi: this.formGroup['value']['formArray'][1]['elementi_progetto'],
      progetto: this.project
    }*/
  }


  onSubmit() {
    this.project = [];
    let count = 0;
    this.formList.forEach(element => {
      let urlL: string[] = [];
      (this.imageUrl[count]) ? urlL = this.imageUrl[count] : urlL = [null]

      this.project.push(
        {
          image: urlL,
          projectNumber: count++,
          luminosa: element['value']['luminosa'],
          palo: element['value']['palo'],
          forma: element['value']['forma'],
          materiale: element['value']['materiale'],
          spessore: element['value']['spessore'],
          laminazione: element['value']['laminazione'],
          calpestabile: element['value']['calpestabile'],
          colore: element['value']['colore'],
          opalino: element['value']['opalino'],
          pieghe: element['value']['pieghe'],
          occhielli: element['value']['occhielli'],
          base: element['value']['base'],
          altezza: element['value']['altezza'],
          lato: element['value']['lato'],
          diametro: element['value']['diametro'],
          copie: element['value']['copie'],
          bifacciale: element['value']['bifacciale'],
          note: element['value']['note']
        })

    });

    this.order = new Order(
      moment().format('lll'),
      this.userService.getOrderId().getValue(),
      this.formGroup['value']['formArray'][0]['nome'],
      this.formGroup['value']['formArray'][1]['elementi_progetto'],
      this.project
    )


    /*this.order =
    {
      id: this.userService.getOrderId().getValue(),
      nome: this.formGroup['value']['formArray'][0]['nome'],
      data: moment().format('lll'),
      pezzi: this.formGroup['value']['formArray'][1]['elementi_progetto'],
      accepted: false,
      progetto: this.project
    }*/

    this.userService.setProject(this.project);
    this.userService.getSubject().subscribe((user) => {
      this.orderService.insertOrder(user, this.order)
      this.orderService.control(user.uId)
    })
    this.userService.updateListOrder(this.order)
    this.showSuccess()
  }


  public isChange(event: MatInput) {
    this.orderService.setReset$(true)
    this.imageUrl= []
    this.pezzi = event['target']['value'];
    this.subject.next(this.setLista(this.pezzi))
    this.subject.subscribe((data) => {
      this.formList = data
    })
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }


  private setLista(param: number): FormGroup[] {
    const form: FormGroup[] = [];

    for (let i = 0; i < this.pezzi; i++) {
      form[i] =
        new FormGroup({
          luminosa: new FormControl(),
          calpestabile: new FormControl(),
          palo: new FormControl(),
          materiale: new FormControl('', [Validators.required]),
          copie: new FormControl('', [Validators.required]),
          forma: new FormControl(),
          spessore: new FormControl(),
          colore: new FormControl(),
          opalino: new FormControl(),
          pieghe: new FormControl(),
          occhielli: new FormControl(),
          laminazione: new FormControl(),
          base: new FormControl(''),
          altezza: new FormControl(''),
          lato: new FormControl(''),
          diametro: new FormControl(''),
          bifacciale: new FormControl(),
          note: new FormControl()
        })
    }
    return form

  }

  setOut(event, numero) {
    this.imageUrl[numero]= event
  }

  showSuccess() {
    this.toastr.success('Ordine aggiunto, in caso di eventuali dubbi verrai ricontattato!', 'Ben Fatto!');
  }
}
