import { Project } from './project';

export class Order {
  data: string;
  oid: string;
  nome: string;
  pezzi: number;
  progetto: Project[];
  externalWork: string;
  external: boolean;
  completed: boolean;

  constructor(data: string, oid: string, nome: string, pezzi: number, progetto: Project[], externalWork: string ,
              external: boolean , completed: boolean){
    this.data = data;
    this.nome = nome;
    this.pezzi = pezzi;
    this.oid = oid;
    this.progetto = progetto;
    this.externalWork = externalWork;
    this.external = external;
    this.completed = completed;

  }
  public getCompleted(){
    return this.completed;
  }

  public setCompleted(param: boolean){
    this.completed = param;

  }
}
