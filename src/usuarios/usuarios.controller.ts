import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Nuevo endpoint: Obtener solo los clientes (rol USER) para el panel de Yamila
  @Get('clientes/lista')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findClientes() {
    const todos = await this.usuariosService.findAll();
    return todos.filter(u => u.rol === 'USER');
  }

  // El registro de usuarios (Post) se queda PÚBLICO para que los clientes puedan registrarse en la web
  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return await this.usuariosService.create(createUsuarioDto);
  }

  // 🛡️ Solo el ADMIN puede ver la lista global de usuarios
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return await this.usuariosService.findAll();
  }

  // 🛡️ Solo el ADMIN (o podrías ampliarlo luego) puede consultar un usuario por ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usuariosService.findOne(id);
  }

  // 🛡️ Protegido: Solo usuarios autenticados pueden modificar
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return await this.usuariosService.update(id, updateUsuarioDto);
  }

  // 🛡️ Solo el ADMIN puede borrar un usuario de la base de datos
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usuariosService.remove(id);
  }
}