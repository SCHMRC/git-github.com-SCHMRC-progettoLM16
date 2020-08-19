export class Order {
  data: string;
  oid: string;
  nome: string;
  pezzi: number;
  progetto: any[];
  accepted = false;

  constructor(data: string, oid: string, nome: string, pezzi: number, progetto: any[]){
    this.data = data;
    this.nome = nome;
    this.pezzi = pezzi;
    this.oid = oid;
    this.progetto = progetto;
    this.accepted = this.getAccepted();

  }
  public getAccepted(){
    return this.accepted;
  }

  public setAccepted(param: boolean){
    this.accepted = param;

  }
}
