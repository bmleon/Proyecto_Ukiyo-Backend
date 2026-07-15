import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { CartaModule } from './carta/carta.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { OfertasModule } from './ofertas/ofertas.module';
import { InventarioModule } from './inventario/inventario.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [PrismaModule, UsuariosModule, AuthModule, EmpleadosModule, CartaModule, PedidosModule, 
    OfertasModule, InventarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
