class DetalleCateringDto {
  platoId!: number;
  cantidadPlatos!: number;
  precioUnitarioPactado!: number;
  notasPlato?: string;
}

export class CreateCateringDto {
  usuarioId?: number; // Opcional
  clienteNombre!: string;
  clienteTelefono!: string;
  clienteEmail!: string;
  fechaEvento!: string; // Se recibirá como ISO String desde Vue (ej. "2026-08-20T18:00:00Z")
  numeroComensales!: number;
  detallesEvento?: string;
  presupuestoEstimado!: number;
  detalles!: DetalleCateringDto[];
}