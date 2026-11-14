import { AgendaRepositorio } from "../domain/agenda-repositorio";
import { EventBus } from "./puertos";

export interface CancelarCitaComando {
  medicoId: string;
  citaId: string;
}

export class CancelarCita {
  constructor(private readonly agendas: AgendaRepositorio, private readonly eventos: EventBus) {}

  async ejecutar(comando: CancelarCitaComando): Promise<void> {
    const agenda = await this.agendas.porMedico(comando.medicoId);
    agenda.cancelar(comando.citaId);
    await this.agendas.guardar(agenda);
    await this.eventos.emit("cita.cancelada", { citaId: comando.citaId, medicoId: comando.medicoId });
  }
}
