import { Agenda } from "./agenda";

export interface AgendaRepositorio {
  porMedico(medicoId: string): Promise<Agenda>;
  guardar(agenda: Agenda): Promise<void>;
}
