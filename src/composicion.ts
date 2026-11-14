import { AgendarCita } from "./application/agendar-cita";
import { CancelarCita } from "./application/cancelar-cita";
import { AgendaRepositorioMemoria } from "./infrastructure/persistence/agenda-repositorio-memoria";
import { AgendaRepositorioJson } from "./infrastructure/persistence/agenda-repositorio-json";
import { EventBusMemoria } from "./infrastructure/messaging/event-bus-memoria";
import { GeneradorIdUuid } from "./infrastructure/id/generador-id-uuid";
import { AgendaController } from "./infrastructure/http/agenda-controller";

export type Persistencia = { tipo: "memoria" } | { tipo: "json"; ruta: string };

export function crearApp(persistencia: Persistencia) {
  const agendas = persistencia.tipo === "memoria"
    ? new AgendaRepositorioMemoria()
    : new AgendaRepositorioJson(persistencia.ruta);
  const eventos = new EventBusMemoria();
  const agendar = new AgendarCita(agendas, eventos, new GeneradorIdUuid());
  const cancelar = new CancelarCita(agendas, eventos);
  const controller = new AgendaController(agendar);
  return { agendas, eventos, agendar, cancelar, controller };
}
