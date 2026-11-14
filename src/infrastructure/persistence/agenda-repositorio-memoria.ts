import { Agenda } from "../../domain/agenda";
import { AgendaRepositorio } from "../../domain/agenda-repositorio";
import { Cita } from "../../domain/cita";

export class AgendaRepositorioMemoria implements AgendaRepositorio {
  private readonly agendas = new Map<string, Agenda>();

  private copiar(agenda: Agenda): Agenda {
    return new Agenda(agenda.medicoId, agenda.citas().map((cita) =>
      Cita.reconstruir(cita.id, cita.pacienteId, cita.rango, cita.estado)));
  }

  async porMedico(medicoId: string): Promise<Agenda> {
    const agenda = this.agendas.get(medicoId);
    return agenda ? this.copiar(agenda) : new Agenda(medicoId);
  }

  async guardar(agenda: Agenda): Promise<void> {
    this.agendas.set(agenda.medicoId, this.copiar(agenda));
  }
}
