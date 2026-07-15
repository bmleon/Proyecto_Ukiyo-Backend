import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { CreateCateringDto } from './dto/create-catering.dto';
import { InventarioService } from '../inventario/inventario.service';

@Injectable()
export class PedidosService {
  private readonly logger = new Logger('PedidosService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly inventarioService: InventarioService, // Inyectamos el servicio de inventario
  ) {}

  // ==========================================
  // FLUX 1: PEDIDOS STANDARD (Restaurante / Delivery)
  // ==========================================

  async createPedido(dto: CreatePedidoDto) {
    this.logger.log(`Registrando nuevo pedido para: ${dto.clienteEmail}`);

    try {
      // Usamos una transacción de Prisma para asegurar que el pedido, sus detalles y el descuento de stock ocurran juntos
      return await this.prisma.$transaction(async (tx) => {
        const nuevoPedido = await tx.pedidos.create({
          data: {
            usuario_id: dto.usuarioId || null,
            cliente_nombre: dto.clienteNombre,
            cliente_telefono: dto.clienteTelefono,
            cliente_email: dto.clienteEmail,
            total: dto.total,
            estado_pago: 'PENDIENTE',
          },
        });

        // Insertamos el carrito de platos asociado al pedido
        await tx.detalle_pedidos.createMany({
          data: dto.detalles.map((d) => ({
            pedido_id: nuevoPedido.id,
            plato_id: d.platoId,
            cantidad: d.cantidad,
            precio_unitario: d.precioUnitario,
          })),
        });

        // Descontamos automáticamente el stock de ingredientes del inventario en base a la receta del plato vendido
        for (const detalle of dto.detalles) {
          await this.inventarioService.descontarStockPorVenta(detalle.platoId, detalle.cantidad);
        }

        return tx.pedidos.findUnique({
          where: { id: nuevoPedido.id },
          include: {
            detalle_pedidos: {
              include: { platos: true },
            },
          },
        });
      });
    } catch (error: any) {
      throw new BadRequestException(`Error al procesar el pedido: ${error.message}`);
    }
  }

  async findAllPedidos() {
    return await this.prisma.pedidos.findMany({
      include: {
        detalle_pedidos: {
          include: { platos: true },
        },
      },
      orderBy: { creado_en: 'desc' },
    });
  }

  async findPedidosByUser(userId: number) {
    return await this.prisma.pedidos.findMany({
      where: { usuario_id: userId },
      include: {
        detalle_pedidos: {
          include: { platos: true },
        },
      },
      orderBy: { creado_en: 'desc' },
    });
  }

  // ==========================================
  // FLUX 2: PEDIDOS DE CATERING
  // ==========================================

  async createCatering(dto: CreateCateringDto) {
    this.logger.log(`Registrando solicitud de catering para: ${dto.clienteEmail}`);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const nuevoCatering = await tx.catering_pedidos.create({
          data: {
            usuario_id: dto.usuarioId || null,
            cliente_nombre: dto.clienteNombre,
            cliente_telefono: dto.clienteTelefono,
            cliente_email: dto.clienteEmail,
            fecha_evento: new Date(dto.fechaEvento),
            numero_comensales: dto.numeroComensales,
            detalles_evento: dto.detallesEvento || null,
            presupuesto_estimado: dto.presupuestoEstimado,
            estado_reserva: 'SOLICITADO',
            estado_pago: 'PENDIENTE',
          },
        });

        await tx.catering_detalles.createMany({
          data: dto.detalles.map((d) => ({
            catering_id: nuevoCatering.id,
            plato_id: d.platoId,
            cantidad_platos: d.cantidadPlatos,
            precio_unitario_pactado: d.precioUnitarioPactado,
            notes_plato: d.notasPlato || null,
          })),
        });

        return tx.catering_pedidos.findUnique({
          where: { id: nuevoCatering.id },
          include: {
            catering_detalles: {
              include: { platos: true },
            },
          },
        });
      });
    } catch (error: any) {
      throw new BadRequestException(`Error al procesar el catering: ${error.message}`);
    }
  }

  async findAllCatering() {
    return await this.prisma.catering_pedidos.findMany({
      include: {
        catering_detalles: {
          include: { platos: true },
        },
      },
      orderBy: { creado_en: 'desc' },
    });
  }

  async updateEstadoCatering(id: number, estado: string) {
    try {
      return await this.prisma.catering_pedidos.update({
        where: { id },
        data: { estado_reserva: estado },
      });
    } catch {
      throw new NotFoundException(`No se encontró la reserva de catering con ID ${id}`);
    }
  }
}