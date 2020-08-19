export class Project {
  materiale: string;
  spessore: number;
  base: number;
  altezza: number;
  bifacciale: boolean;
  file: any[];

  constructor(materiale: string, spessore: number, base: number, altezza: number, bifacciale: boolean, file: any[])
  {
    this.materiale = materiale;
    this.spessore = spessore;
    this.base = base;
    this.altezza = altezza;
    this.bifacciale = bifacciale;
    this.file = file;
  }
}
