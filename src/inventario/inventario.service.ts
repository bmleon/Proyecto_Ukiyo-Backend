import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { RecetaPlatoDto } from './dto/receta-plato.dto';

@Injectable()
export class InventarioService {
  private readonly logger = new Logger('InventarioService');

  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // GESTIÓN DE INSUMOS (ALMACÉN)
  // ==========================================

  async createInsumo(dto: CreateInsumoDto) {
    this.logger.log(`Registrando nuevo insumo: ${dto.nombre}`);
    try {
      return await this.prisma.inventario.create({
        data: {
          nombre: dto.nombre,
          stock_actual: dto.stockActual,
          stock_minimo: dto.stockMinimo ?? 1.00,
          unidad_medida: dto.unidadMedida ?? 'unidades',
        },
      });
    } catch (error: any) {
      throw new BadRequestException(`Error al registrar insumo: ${error.message}`);
    }
  }

  async findAllInsumos() {
    return await this.prisma.inventario.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async updateStock(id: number, nuevoStock: number) {
    try {
      return await this.prisma.inventario.update({
        where: { id },
        data: { stock_actual: nuevoStock },
      });
    } catch {
      throw new NotFoundException(`Insumo con ID ${id} no encontrado.`);
    }
  }

  // ==========================================
  // GESTIÓN DE COMPOSICIÓN / RECETAS DE PLATOS
  // ==========================================

  async asociarReceta(dto: RecetaPlatoDto) {
    this.logger.log(`Asociando receta al plato ID: ${dto.platoId}`);
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. Limpiamos cualquier ingrediente previo que tuviera el plato
        await tx.composicion_platos.deleteMany({
          where: { plato_id: dto.platoId },
        });

        // 2. Registramos la nueva lista de ingredientes
        await tx.composicion_platos.createMany({
          data: dto.ingredientes.map((ing) => ({
            plato_id: dto.platoId,
            insumo_id: ing.insumoId,
            cantidad_necesaria: ing.cantidadNecesaria,
          })),
        });

        return tx.composicion_platos.findMany({
          where: { plato_id: dto.platoId },
          include: { inventario: true },
        });
      });
    } catch (error: any) {
      throw new BadRequestException(`Error al asociar la receta: ${error.message}`);
    }
  }

  async obtenerRecetaPlato(platoId: number) {
    const receta = await this.prisma.composicion_platos.findMany({
      where: { plato_id: platoId },
      include: { inventario: true },
    });
    if (!receta || receta.length === 0) {
      throw new NotFoundException(`El plato con ID ${platoId} no tiene una receta definida.`);
    }
    return receta;
  }

  // ==========================================
  // DESCUENTO AUTOMÁTICO DE STOCK POR VENTA
  // ==========================================

  async descontarStockPorVenta(platoId: number, cantidadVendida: number) {
    try {
      const ingredientes = await this.prisma.composicion_platos.findMany({
        where: { plato_id: platoId },
      });

      for (const ingrediente of ingredientes) {
        const cantidadADescontar = Number(ingrediente.cantidad_necesaria) * cantidadVendida;
        
        // Buscamos el insumo actual
        const insumo = await this.prisma.inventario.findUnique({
          where: { id: ingrediente.insumo_id },
        });

        if (insumo) {
          const nuevoStock = Number(insumo.stock_actual) - cantidadADescontar;
          
          await this.prisma.inventario.update({
            where: { id: insumo.id },
            data: { stock_actual: nuevoStock >= 0 ? nuevoStock : 0 }, // Evitamos stocks negativos
          });

          // Alerta visual en el terminal por si se queda sin existencias
          if (nuevoStock <= Number(insumo.stock_minimo)) {
            this.logger.warn(`¡ALERTA DE STOCK! El insumo "${insumo.nombre}" está bajo mínimos (${nuevoStock} ${insumo.unidad_medida})`);
          }
        }
      }
    } catch (error: any) {
      this.logger.error(`No se pudo descontar stock para el plato ${platoId}: ${error.message}`);
    }
  }
}