import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CartaService } from './carta.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('carta') // Prefijo global: http://localhost:3001/carta
export class CartaController {
  constructor(private readonly cartaService: CartaService) {}

  // ==========================================
  // ENDPOINTS PÚBLICOS (Para tus clientes en Nuxt)
  // ==========================================

  @Get('platos')
  async getPlatos() {
    return await this.cartaService.findAllPlatos();
  }

  @Get('platos/:id')
  async getPlatoById(@Param('id', ParseIntPipe) id: number) {
    return await this.cartaService.findOnePlato(id);
  }

  @Get('categorias')
  async getCategorias() {
    return await this.cartaService.findAllCategorias();
  }

  @Get('alergenos')
  async getAlergenos() {
    return await this.cartaService.findAllAlergenos();
  }

  // ==========================================
  // ENDPOINTS PRIVADOS (Solo para Yamila / ADMIN)
  // ==========================================

  @Post('categorias')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createCategoria(@Body() dto: CreateCategoriaDto) {
    return await this.cartaService.createCategoria(dto);
  }

  @Post('platos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createPlato(@Body() dto: CreatePlatoDto) {
    return await this.cartaService.createPlato(dto);
  }

  @Put('platos/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updatePlato(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreatePlatoDto>) {
    return await this.cartaService.updatePlato(id, dto);
  }

  @Delete('platos/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removePlato(@Param('id', ParseIntPipe) id: number) {
    return await this.cartaService.removePlato(id);
  }
}