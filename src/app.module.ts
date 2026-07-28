import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'; // 🆕 Importamos las herramientas de Rate Limiting
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
  imports: [
    // 🆕 Configuración del limitador: máximo 60 peticiones por minuto por cada IP
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto en milisegundos
      limit: 60,  // Límite de peticiones
    }]),
    PrismaModule, 
    UsuariosModule, 
    AuthModule, 
    EmpleadosModule, 
    CartaModule, 
    PedidosModule, 
    OfertasModule, 
    InventarioModule
  ],
  controllers: [AppController],
  // 🆕 Añadimos el ThrottlerGuard como guard global en los providers
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}