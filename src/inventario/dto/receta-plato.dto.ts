class IngredienteRecetaDto {
  insumoId!: number;
  cantidadNecesaria!: number; // Lo que se resta del stock por cada venta
}

export class RecetaPlatoDto {
  platoId!: number;
  ingredientes!: IngredienteRecetaDto[];
}