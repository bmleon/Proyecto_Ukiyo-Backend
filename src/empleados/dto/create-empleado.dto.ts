export class CreateEmpleadoDto {
  nombre!: string;
  cargo!: string;     // 'Cocinero', 'Repartidor', 'Camarero', etc.
  telefono?: string;  // Opcional
}