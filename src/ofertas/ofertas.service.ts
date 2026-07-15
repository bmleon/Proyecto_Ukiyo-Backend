import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';

@Injectable()
export class OfertasService {
  private readonly logger = new Logger('OfertasService');

  constructor(private readonly prisma: PrismaService) {}

  // 1. Crear una nueva oferta asociada a un plato
  async create(dto: CreateOfertaDto) {
    this.logger.log(`Creando oferta "${dto.nombre}" para el plato ID: ${dto.platoId}`);
    try {
      return await this.prisma.ofertas.create({
        data: {
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          porcentaje_desc: dto.porcentajeDesc,
          fecha_inicio: new Date(dto.fechaInicio),
          fecha_fin: new Date(dto.fechaFin),
          plato_id: dto.platoId,
          activo: dto.activo ?? true,
        },
        include: {
          platos: true,
        }
      });
    } catch (error: any) {
      throw new BadRequestException(`Error al crear la oferta: ${error.message}`);
    }
  }

  // 2. Obtener TODAS las ofertas (para que Yamila las gestione en su panel de control)
  async findAll() {
    return await this.prisma.ofertas.findMany({
      include: {
        platos: {
          include: {
            categorias: true
          }
        }
      },
      orderBy: { creado_en: 'desc' },
    });
  }

  // 3. Obtener solo las ofertas ACTIVAS en este instante (para mostrarlas directamente en la web de clientes)
  async findActivas() {
    const ahora = new Date();
    return await this.prisma.ofertas.findMany({
      where: {
        activo: true,
        fecha_inicio: { lte: ahora }, // fecha_inicio tiene que ser menor o igual que ahora
        fecha_fin: { gte: ahora },    // fecha_fin tiene que ser mayor o igual que ahora
      },
      include: {
        platos: {
          include: {
            categorias: true
          }
        }
      }
    });
  }

  // 4. Activar o desactivar manualmente una oferta con un interruptor (switch)
  async toggleEstado(id: number, activo: boolean) {
    try {
      return await this.prisma.ofertas.update({
        where: { id },
        data: { activo },
      });
    } catch {
      throw new NotFoundException(`La oferta con ID ${id} no existe.`);
    }
  }

  // 5. Eliminar una oferta
  async remove(id: number) {
    try {
      return await this.prisma.ofertas.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`La oferta con ID ${id} no existe.`);
    }
  }
}