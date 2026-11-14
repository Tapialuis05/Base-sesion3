import { AgendarCita } from "../../application/agendar-cita";
import { CruceDeHorarioError, RangoInvalidoError } from "../../domain/errores";

export interface RespuestaAgenda {
  status: number;
  body: { citaId: string } | { error: string };
}

export class AgendaController {
  constructor(private readonly agendar: AgendarCita) {}

  async post(cuerpo: unknown): Promise<RespuestaAgenda> {
    if (typeof cuerpo !== "object" || cuerpo === null) {
      return { status: 400, body: { error: "Se requiere un objeto con los datos de la cita." } };
    }
    const { medicoId, pacienteId, inicio, fin } = cuerpo as Record<string, unknown>;
    if (typeof medicoId !== "string" || !medicoId.trim() ||
        typeof pacienteId !== "string" || !pacienteId.trim() ||
        typeof inicio !== "string" || typeof fin !== "string") {
      return { status: 400, body: { error: "Faltan datos válidos de médico, paciente u horario." } };
    }
    try {
      const citaId = await this.agendar.ejecutar({
        medicoId, pacienteId, inicio: new Date(inicio), fin: new Date(fin),
      });
      return { status: 201, body: { citaId } };
    } catch (error) {
      if (error instanceof CruceDeHorarioError) {
        return { status: 409, body: { error: error.message } };
      }
      if (error instanceof RangoInvalidoError) {
        return { status: 400, body: { error: error.message } };
      }
      throw error;
    }
  }
}
