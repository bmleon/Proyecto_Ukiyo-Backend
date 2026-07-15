import { Controller, Get, Post, Body, Param, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { CreateCateringDto } from './dto/create-catering.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('pedidos') // Prefijo global: http://localhost:3001/pedidos
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // ==========================================
  // ENDPOINTS DE CLIENTES (Crear pedidos)
  // ==========================================

  @Post() // POST http://localhost:3001/pedidos
  async createPedido(@Body() createPedidoDto: CreatePedidoDto) {
    return await this.pedidosService.createPedido(createPedidoDto);
  }

  @Post('catering') // POST http://localhost:3001/pedidos/catering
  async createCatering(@Body() createCateringDto: CreateCateringDto) {
    return await this.pedidosService.createCatering(createCateringDto);
  }

  @Get('mis-pedidos/:userId') // GET http://localhost:3001/pedidos/mis-pedidos/12
  @UseGuards(JwtAuthGuard)
  async getMisPedidos(@Param('userId', ParseIntPipe) userId: number) {
    return await this.pedidosService.findPedidosByUser(userId);
  }

  // ==========================================
  // ENDPOINTS DE ADMINISTRACIÓN (Solo Yamila / ADMIN)
  // ==========================================

  @Get() // GET http://localhost:3001/pedidos
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllPedidos() {
    return await this.pedidosService.findAllPedidos();
  }

  @Get('catering/todas') // GET http://localhost:3001/pedidos/catering/todas
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllCatering() {
    return await this.pedidosService.findAllCatering();
  }

  @Put('catering/:id/estado') // PUT http://localhost:3001/pedidos/catering/1/estado
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateEstadoCatering(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
  ) {
    return await this.pedidosService.updateEstadoCatering(id, estado);
  }
}