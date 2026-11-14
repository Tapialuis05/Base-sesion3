export class RangoInvalidoError extends Error {
  constructor() { super("El fin debe ser posterior al inicio y ambas fechas deben ser válidas."); }
}

export class CruceDeHorarioError extends Error {
  constructor() { super("El horario se cruza con una cita activa."); }
}

export class CitaYaCanceladaError extends Error {
  constructor() { super("La cita ya está cancelada."); }
}

export class CitaNoEncontradaError extends Error {
  constructor() { super("La cita no existe en la agenda."); }
}
