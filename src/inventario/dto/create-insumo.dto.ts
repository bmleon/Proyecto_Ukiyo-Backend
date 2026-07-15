export class CreateInsumoDto {
  nombre!: string;
  stockActual!: number;
  stockMinimo?: number;
  unidadMedida?: string; // 'kg', 'g', 'l', 'unidades', etc.
}