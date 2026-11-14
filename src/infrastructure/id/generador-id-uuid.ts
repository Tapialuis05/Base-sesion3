import { randomUUID } from "node:crypto";
import { GeneradorId } from "../../application/puertos";

export class GeneradorIdUuid implements GeneradorId {
  nuevo(): string { return randomUUID(); }
}
