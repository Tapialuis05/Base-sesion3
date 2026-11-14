import { Cita } from "./cita";
import { CitaNoEncontradaError, CruceDeHorarioError } from "./errores";

export class Agenda {
  private readonly lista: Cita[];

  constructor(readonly medicoId: string, citas: readonly Cita[] = []) {
    this.lista = [...citas];
  }

  citas(): readonly Cita[] { return [...this.lista]; }

  agendar(cita: Cita): void {
    if (cita.activa() && this.lista.some((existente) =>
      existente.activa() && existente.rango.seCruzaCon(cita.rango))) {
      throw new CruceDeHorarioError();
    }
    this.lista.push(cita);
  }

  cancelar(citaId: string): void {
    const cita = this.lista.find((c) => c.id === citaId);
    if (!cita) throw new CitaNoEncontradaError();
    cita.cancelar();
  }
}
