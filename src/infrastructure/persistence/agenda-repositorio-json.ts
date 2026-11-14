import { readFile, writeFile } from "node:fs/promises";
import { Agenda } from "../../domain/agenda";
import { AgendaRepositorio } from "../../domain/agenda-repositorio";
import { Cita, EstadoCita } from "../../domain/cita";
import { RangoHorario } from "../../domain/rango-horario";

interface CitaGuardada {
  id: string;
  pacienteId: string;
  inicio: string;
  fin: string;
  estado: EstadoCita;
}

interface AgendaGuardada {
  medicoId: string;
  citas: CitaGuardada[];
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function esCitaGuardada(valor: unknown): valor is CitaGuardada {
  return esObjeto(valor) && typeof valor.id === "string" &&
    typeof valor.pacienteId === "string" && typeof valor.inicio === "string" &&
    typeof valor.fin === "string" && (valor.estado === "confirmada" || valor.estado === "cancelada");
}

function esAgendaGuardada(valor: unknown): valor is AgendaGuardada {
  return esObjeto(valor) && typeof valor.medicoId === "string" &&
    Array.isArray(valor.citas) && valor.citas.every(esCitaGuardada);
}

export class AgendaRepositorioJson implements AgendaRepositorio {
  constructor(private readonly ruta: string) {}

  private async leer(): Promise<AgendaGuardada[]> {
    let contenido: string;
    try {
      contenido = await readFile(this.ruta, "utf8");
    } catch (error) {
      if (esObjeto(error) && error.code === "ENOENT") return [];
      throw error;
    }
    const datos: unknown = JSON.parse(contenido);
    if (!Array.isArray(datos) || !datos.every(esAgendaGuardada)) {
      throw new Error("El archivo de agendas tiene un formato inválido.");
    }
    return datos;
  }

  async porMedico(medicoId: string): Promise<Agenda> {
    const guardada = (await this.leer()).find((agenda) => agenda.medicoId === medicoId);
    if (!guardada) return new Agenda(medicoId);
    return new Agenda(medicoId, guardada.citas.map((cita) => Cita.reconstruir(
      cita.id, cita.pacienteId,
      RangoHorario.crear(new Date(cita.inicio), new Date(cita.fin)), cita.estado,
    )));
  }

  async guardar(agenda: Agenda): Promise<void> {
    const agendas = await this.leer();
    const guardada: AgendaGuardada = {
      medicoId: agenda.medicoId,
      citas: agenda.citas().map((cita) => ({
        id: cita.id, pacienteId: cita.pacienteId, estado: cita.estado,
        inicio: cita.rango.inicio.toISOString(), fin: cita.rango.fin.toISOString(),
      })),
    };
    const indice = agendas.findIndex((existente) => existente.medicoId === agenda.medicoId);
    if (indice === -1) agendas.push(guardada);
    else agendas[indice] = guardada;
    await writeFile(this.ruta, JSON.stringify(agendas, null, 2), "utf8");
  }
}
