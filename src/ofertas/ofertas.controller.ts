import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { OfertasService } from './ofertas.service';
import { CreateOfertaDto } from './dto/create-oferta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('ofertas') // Prefijo: http://localhost:3001/ofertas
export class OfertasController {
  constructor(private readonly ofertasService: OfertasService) {}

  // Endpoint público para que la web de Nuxt liste las promociones del día
  @Get('activas') // GET /ofertas/activas
  async getActivas() {
    return await this.ofertasService.findActivas();
  }

  // Endpoints administrativos protegidos (Solo administradores)
  @Post() // POST /ofertas
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() createOfertaDto: CreateOfertaDto) {
    return await this.ofertasService.create(createOfertaDto);
  }

  @Get() // GET /ofertas
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return await this.ofertasService.findAll();
  }

  @Put(':id/estado') // PUT /ofertas/1/estado
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async toggleEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('activo') activo: boolean,
  ) {
    return await this.ofertasService.toggleEstado(id, activo);
  }

  @Delete(':id') // DELETE /ofertas/1
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ofertasService.remove(id);
  }
}