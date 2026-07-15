export class CreateOfertaDto {
  nombre!: string;
  descripcion?: string;
  porcentajeDesc!: number; // Ej: 15.00 para un 15% de descuento
  fechaInicio!: string;    // Se recibe como string de fecha ISO
  fechaFin!: string;       // Se recibe como string de fecha ISO
  platoId!: number;
  activo?: boolean;
}