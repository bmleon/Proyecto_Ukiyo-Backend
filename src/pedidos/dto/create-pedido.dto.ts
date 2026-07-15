class DetallePedidoDto {
  platoId!: number;
  cantidad!: number;
  precioUnitario!: number;
}

export class CreatePedidoDto {
  usuarioId?: number; // Opcional (por si es un usuario invitado que no se ha registrado)
  clienteNombre!: string;
  clienteTelefono!: string;
  clienteEmail!: string;
  total!: number;
  detalles!: DetallePedidoDto[];
}