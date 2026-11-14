import { EventBus } from "../../application/puertos";

export class EventBusMemoria implements EventBus {
  readonly emitidos: Array<{ nombre: string; datos: Record<string, unknown> }> = [];

  async emit(nombre: string, datos: Record<string, unknown>): Promise<void> {
    this.emitidos.push({ nombre, datos: { ...datos } });
  }
}
