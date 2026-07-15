import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadosService {
  private readonly logger = new Logger('EmpleadosService');

  constructor(private readonly prisma: PrismaService) {}

  // 1. Registrar un nuevo empleado
  async create(createDto: CreateEmpleadoDto) {
    this.logger.log(`Registrando nuevo empleado: ${createDto.nombre}`);
    try {
      return await this.prisma.empleados.create({
        data: {
          nombre: createDto.nombre,
          cargo: createDto.cargo,
          telefono: createDto.telefono || null,
        },
      });
    } catch (error: any) {
      throw new BadRequestException(`Error al registrar el empleado: ${error.message}`);
    }
  }

  // 2. Listar todos los empleados
  async findAll() {
    return await this.prisma.empleados.findMany({
      orderBy: { creado_en: 'desc' },
    });
  }

  // 3. Buscar un empleado por su ID
  async findOne(id: number) {
    const empleado = await this.prisma.empleados.findUnique({
      where: { id },
    });

    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado.`);
    }

    return empleado;
  }

  // 4. Actualizar datos de un empleado
  async update(id: number, updateDto: UpdateEmpleadoDto) {
    await this.findOne(id); // Valida que exista primero

    try {
      return await this.prisma.empleados.update({
        where: { id },
        data: updateDto,
      });
    } catch (error: any) {
      throw new BadRequestException(`Error al actualizar el empleado: ${error.message}`);
    }
  }

  // 5. Eliminar un empleado
  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.empleados.delete({
      where: { id },
    });
  }
}