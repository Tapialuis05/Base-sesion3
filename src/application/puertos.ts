export interface EventBus {
  emit(nombre: string, datos: Record<string, unknown>): Promise<void>;
}

export interface GeneradorId {
  nuevo(): string;
}
