import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreatePlatoDto } from './dto/create-plato.dto';

@Injectable()
export class CartaService {
  private readonly logger = new Logger('CartaService');

  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // MÉTODOS DE CATEGORÍAS
  // ==========================================

  async createCategoria(dto: CreateCategoriaDto) {
    try {
      return await this.prisma.categorias.create({ data: dto });
    } catch (error: any) {
      throw new BadRequestException(`Error al crear categoría: ${error.message}`);
    }
  }

  async findAllCategorias() {
    return await this.prisma.categorias.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  // ==========================================
  // MÉTODOS DE ALÉRGENOS
  // ==========================================

  async findAllAlergenos() {
    return await this.prisma.alergenos.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  // ==========================================
  // MÉTODOS DE PLATOS
  // ==========================================

  // Helper para transformar el formato de Prisma (tabla intermedia) a un formato limpio para el frontend
  private mapearPlatoConAlergenos(plato: any) {
    if (!plato) return null;
    
    // Extraemos los alérgenos reales de la tabla intermedia
    const alergenosLimpios = plato.plato_alergenos 
      ? plato.plato_alergenos.map((pa: any) => pa.alergenos) 
      : [];

    // Eliminamos la propiedad de la tabla intermedia y añadimos el array limpio
    const { plato_alergenos, ...restoPlato } = plato;
    return {
      ...restoPlato,
      alergenos: alergenosLimpios,
    };
  }

  // 1. Registrar un plato asociándole su categoría y alérgenos
  async createPlato(dto: CreatePlatoDto) {
    this.logger.log(`Añadiendo nuevo plato a la carta: ${dto.nombre}`);
    try {
      const { alergenosIds, ...datosPlato } = dto;

      const nuevoPlato = await this.prisma.platos.create({
        data: {
          nombre: datosPlato.nombre,
          descripcion: datosPlato.descripcion,
          precio: datosPlato.precio,
          imagen_url: datosPlato.imagen || null,
          disponible: dto.disponible ?? true,
          categoria_id: datosPlato.categoriaId,
          // Creamos los registros correspondientes en la tabla intermedia de manera atómica
          plato_alergenos: alergenosIds && alergenosIds.length > 0 ? {
            create: alergenosIds.map(id => ({
              alergeno_id: id
            }))
          } : undefined
        },
        include: {
          categorias: true,
          plato_alergenos: {
            include: {
              alergenos: true
            }
          }
        }
      });

      return this.mapearPlatoConAlergenos(nuevoPlato);
    } catch (error: any) {
      throw new BadRequestException(`Error al crear el plato: ${error.message}`);
    }
  }

  // 2. Obtener toda la carta (Platos con sus categorías y alérgenos)
  async findAllPlatos() {
    const listaPlatos = await this.prisma.platos.findMany({
      include: {
        categorias: true,
        plato_alergenos: {
          include: {
            alergenos: true
          }
        }
      },
      orderBy: { nombre: 'asc' },
    });

    return listaPlatos.map(plato => this.mapearPlatoConAlergenos(plato));
  }

  // 3. Buscar plato por ID
  async findOnePlato(id: number) {
    const plato = await this.prisma.platos.findUnique({
      where: { id },
      include: {
        categorias: true,
        plato_alergenos: {
          include: {
            alergenos: true
          }
        }
      }
    });

    if (!plato) {
      throw new NotFoundException(`El plato con ID ${id} no existe en la carta.`);
    }

    return this.mapearPlatoConAlergenos(plato);
  }

  // 4. Actualizar un plato y refrescar sus alérgenos asociados
  async updatePlato(id: number, dto: Partial<CreatePlatoDto>) {
    await this.findOnePlato(id);
    try {
      const { alergenosIds, ...datosPlato } = dto;

      // Si nos pasan un nuevo array de alérgenos, primero eliminamos las relaciones viejas
      if (alergenosIds) {
        await this.prisma.plato_alergenos.deleteMany({
          where: { plato_id: id }
        });
      }

      const platoActualizado = await this.prisma.platos.update({
        where: { id },
        data: {
          nombre: datosPlato.nombre,
          descripcion: datosPlato.descripcion,
          precio: datosPlato.precio,
          imagen_url: datosPlato.imagen,
          disponible: dto.disponible,
          categoria_id: datosPlato.categoriaId,
          // Creamos las nuevas relaciones
          plato_alergenos: alergenosIds && alergenosIds.length > 0 ? {
            create: alergenosIds.map(id => ({
              alergeno_id: id
            }))
          } : undefined
        },
        include: {
          categorias: true,
          plato_alergenos: {
            include: {
              alergenos: true
            }
          }
        }
      });

      return this.mapearPlatoConAlergenos(platoActualizado);
    } catch (error: any) {
      throw new BadRequestException(`Error al actualizar el plato: ${error.message}`);
    }
  }

  // 5. Eliminar plato de la carta
  async removePlato(id: number) {
    await this.findOnePlato(id);
    return await this.prisma.platos.delete({
      where: { id }
    });
  }
}