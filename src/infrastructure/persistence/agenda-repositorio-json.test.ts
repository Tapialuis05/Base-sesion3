import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { Agenda } from "../../domain/agenda";
import { Cita } from "../../domain/cita";
import { RangoHorario } from "../../domain/rango-horario";
import { AgendaRepositorioJson } from "./agenda-repositorio-json";

it("recupera citas y cancelaciones desde otra instancia sin perder otros médicos", async () => {
  const carpeta = await mkdtemp(join(tmpdir(), "saludya-persistencia-"));
  try {
    const ruta = join(carpeta, "agendas.json");
    const rango = RangoHorario.crear(
      new Date("2026-11-16T09:00:00Z"), new Date("2026-11-16T09:30:00Z"),
    );
    const original = new AgendaRepositorioJson(ruta);
    for (const medicoId of ["m1", "m2"]) {
      const agenda = new Agenda(medicoId);
      agenda.agendar(Cita.nueva(`c-${medicoId}`, "p1", rango));
      await original.guardar(agenda);
    }

    const segundaInstancia = new AgendaRepositorioJson(ruta);
    const agenda = await segundaInstancia.porMedico("m1");
    expect(agenda.citas()[0].rango.igualA(rango)).toBe(true);
    agenda.cancelar("c-m1");
    await segundaInstancia.guardar(agenda);

    const terceraInstancia = new AgendaRepositorioJson(ruta);
    const cancelada = await terceraInstancia.porMedico("m1");
    expect(cancelada.citas()[0].estado).toBe("cancelada");
    expect(() => cancelada.agendar(Cita.nueva("reemplazo", "p2", rango))).not.toThrow();
    const otraAgenda = await terceraInstancia.porMedico("m2");
    expect(otraAgenda.citas()[0].id).toBe("c-m2");
    expect(otraAgenda.citas()[0].activa()).toBe(true);
  } finally {
    await rm(carpeta, { recursive: true, force: true });
  }
});
