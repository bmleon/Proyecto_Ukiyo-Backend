export class CreatePlatoDto {
  nombre!: string;
  descripcion!: string;
  precio!: number;
  imagen?: string;
  disponible?: boolean; // Por defecto true
  categoriaId!: number; // Relación con la categoría
  alergenosIds?: number[]; // Array de IDs de alérgenos para asociarlos de golpe
}