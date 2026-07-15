import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger('UsuariosService');

  constructor(private readonly prisma: PrismaService) {}

  // 1. Crear un usuario (Registro)
  async create(createDto: CreateUsuarioDto) {
    this.logger.log(`Registrando nuevo usuario: ${createDto.email}`);

    try {
      // Verificar si el email ya existe
      const existeEmail = await this.prisma.usuarios.findUnique({
        where: { email: createDto.email },
      });

      if (existeEmail) {
        throw new BadRequestException('El correo electrónico ya está registrado.');
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(createDto.password || '123456', 10);

      return await this.prisma.usuarios.create({
        data: {
          nombre: createDto.nombre,
          apellidos: createDto.apellidos || null,
          email: createDto.email,
          password: hashedPassword,
          rol: createDto.rol || 'USER',
          telefono: createDto.telefono || null,
          direccion: createDto.direccion || null,
        },
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  // 2. Obtener todos los usuarios
  async findAll() {
    return await this.prisma.usuarios.findMany({
      orderBy: { creado_en: 'desc' },
    });
  }

  // 3. Obtener un usuario por su ID
  async findOne(id: number) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    return usuario;
  }

  // 4. Buscar un usuario por email (Esencial para el Login posterior)
  async findByEmail(email: string) {
    return await this.prisma.usuarios.findUnique({
      where: { email },
    });
  }

  // 5. Actualizar los datos del usuario (Nombre, Apellidos, Teléfono, Dirección...)
  async update(id: number, updateDto: UpdateUsuarioDto) {
    // Validar que el usuario existe antes de actualizar
    await this.findOne(id);

    try {
      const dataToUpdate: any = { ...updateDto };

      // Si se actualiza la contraseña, la volvemos a encriptar
      if (updateDto.password) {
        dataToUpdate.password = await bcrypt.hash(updateDto.password, 10);
      }

      return await this.prisma.usuarios.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  // 6. Eliminar un usuario
  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.usuarios.delete({
      where: { id },
    });
  }
}