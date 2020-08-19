export class User {
  name: string;
  email: string;
  mobile: string;
  uId: string;
  utente: string;
  idProjectFK: string[] = [];
  graficoEmail = '';

  constructor(name: string, email: string, mobile: string, utente: string, uId: string, graficoEmail: string) {
    this.name = name;
    this.email = email;
    this.mobile = mobile;
    this.uId = uId;
    this.utente = utente;
    this.idProjectFK = [];
    this.graficoEmail = graficoEmail;
  }

  public setiIdPrijectFk(param: string) {
    this.idProjectFK.push(param);
  }

}
