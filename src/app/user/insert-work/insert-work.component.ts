import { Component, OnInit, NgZone, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatInput } from '@angular/material/input';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/services/user';
import { UserService } from 'src/app/services/user.service';
import { TIPO, SPESSORE } from './../../services/material-list';
import { map, take, filter, pluck } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import * as Rx from 'rxjs';
import * as Operators from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as id from 'shortid';
import * as moment from 'moment';
//tslint:disable

@Component({
  selector: 'app-insert-work',
  templateUrl: './insert-work.component.html',
  styleUrls: ['./insert-work.component.scss']
})
export class InsertWorkComponent implements OnInit {
  isEditable = false;
  erroMsg: any;
  check: boolean[] = [false];
  lista: any[] = []
  tipo: string[] = [];
  spessore: number[] = [];
  project: Object[] = [];
  user: User;
  order: Object;
  subject: Rx.BehaviorSubject<any> = new Rx.BehaviorSubject(null);
  showModal: Rx.BehaviorSubject<boolean> = new Rx.BehaviorSubject(false);
  enter: Rx.BehaviorSubject<any> = new Rx.BehaviorSubject(null);
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  show = false;
  key: number;
  forma: any[] = [];


  formGroup: FormGroup;
  formList: FormGroup[] = [];
  pezzi = 1;


  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private userService: UserService,
    private orderService: OrderService,
    private _ngZone: NgZone,
    private toastr: ToastrService) {
    this.tipo = TIPO;
    this.spessore = SPESSORE;


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

    this.order =
    {
      nome: this.formGroup['value']['formArray'][0]['nome'],
      data: moment().format('LLL'),
      pezzi: this.formGroup['value']['formArray'][1]['elementi_progetto'],
      progetto: this.project
    }
  }



  onSubmit() {
    this.project = [];
    let obj = { nome: [{nome: 'ciao'}]}
    let count = 0;
    this.formList.forEach(element => {
      this.project.push(
        {
          projectNumber: count++,
          insegna: element['value']['insegna'],
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
          multiplefile: element['value']['multiplefile'],
          note: element['value']['note']
        })
    });


    this.order =
    {
      id: id.generate(),
      nome: this.formGroup['value']['formArray'][0]['nome'],
      data: moment().format('lll'),
      pezzi: this.formGroup['value']['formArray'][1]['elementi_progetto'],
      accepted: false,
      progetto: this.project
    }

    this.project.forEach(element => {
      if (element !== null) {
        if (element['multiplefile']['files'] !== undefined) {
          element['multiplefile']['files'].forEach((file: File) => {
            this.storageService.storageFile(this.userService.getSubject().value, element['projectNumber'], this.order, file)
          })

        }
      }
    });
    this.userService.setProject(this.project);
    this.userService.getSubject().subscribe((user) => {
      this.orderService.insertOrder(user, this.order)
      this.orderService.control(user.uId)
    })
    this.userService.updateListOrder(this.order)


    this.showSuccess()
  }

  public isChecked(event: MatCheckboxChange, index: number) {
    this.check[index] = event.checked;
  }

  public isChange(event: MatInput) {
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
          insegna: new FormControl(),
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
          multiplefile: new FormControl(['']),
          note: new FormControl()
        })
    }
    return form

  }

  showSuccess() {
    this.toastr.success('Ordine aggiunto, in caso di eventuali dubbi verrai ricontattato!', 'Ben Fatto!');
  }
}
