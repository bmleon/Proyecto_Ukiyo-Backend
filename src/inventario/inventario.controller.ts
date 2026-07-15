import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { RecetaPlatoDto } from './dto/receta-plato.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('inventario') // http://localhost:3001/inventario
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') // Todo el controlador queda protegido para Yamila
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post('insumos') // POST /inventario/insumos
  async createInsumo(@Body() dto: CreateInsumoDto) {
    return await this.inventarioService.createInsumo(dto);
  }

  @Get('insumos') // GET /inventario/insumos
  async findAllInsumos() {
    return await this.inventarioService.findAllInsumos();
  }

  @Put('insumos/:id/stock') // PUT /inventario/insumos/1/stock
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('stockActual') stockActual: number,
  ) {
    return await this.inventarioService.updateStock(id, stockActual);
  }

  @Post('recetas') // POST /inventario/recetas
  async asociarReceta(@Body() dto: RecetaPlatoDto) {
    return await this.inventarioService.asociarReceta(dto);
  }

  @Get('recetas/plato/:platoId') // GET /inventario/recetas/plato/5
  async obtenerReceta(@Param('platoId', ParseIntPipe) platoId: number) {
    return await this.inventarioService.obtenerRecetaPlato(platoId);
  }
}