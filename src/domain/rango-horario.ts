import { RangoInvalidoError } from "./errores";

export class RangoHorario {
  private constructor(private readonly desde: number, private readonly hasta: number) {}

  static crear(inicio: Date, fin: Date): RangoHorario {
    const desde = inicio.getTime();
    const hasta = fin.getTime();
    if (!Number.isFinite(desde) || !Number.isFinite(hasta) || hasta <= desde) {
      throw new RangoInvalidoError();
    }
    return new RangoHorario(desde, hasta);
  }

  get inicio(): Date { return new Date(this.desde); }
  get fin(): Date { return new Date(this.hasta); }
  duracionMinutos(): number { return (this.hasta - this.desde) / 60000; }
  seCruzaCon(otro: RangoHorario): boolean {
    return this.desde < otro.hasta && otro.desde < this.hasta;
  }
  igualA(otro: RangoHorario): boolean {
    return this.desde === otro.desde && this.hasta === otro.hasta;
  }
}
