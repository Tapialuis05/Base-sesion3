import { AgendaRepositorio } from "../domain/agenda-repositorio";
import { Cita } from "../domain/cita";
import { RangoHorario } from "../domain/rango-horario";
import { EventBus, GeneradorId } from "./puertos";

export interface AgendarCitaComando {
  medicoId: string;
  pacienteId: string;
  inicio: Date;
  fin: Date;
}

export class AgendarCita {
  constructor(
    private readonly agendas: AgendaRepositorio,
    private readonly eventos: EventBus,
    private readonly ids: GeneradorId,
  ) {}

  async ejecutar(comando: AgendarCitaComando): Promise<string> {
    const rango = RangoHorario.crear(comando.inicio, comando.fin);
    const agenda = await this.agendas.porMedico(comando.medicoId);
    const cita = Cita.nueva(this.ids.nuevo(), comando.pacienteId, rango);
    agenda.agendar(cita);
    await this.agendas.guardar(agenda);
    await this.eventos.emit("cita.confirmada", { citaId: cita.id, medicoId: comando.medicoId });
    return cita.id;
  }
}
