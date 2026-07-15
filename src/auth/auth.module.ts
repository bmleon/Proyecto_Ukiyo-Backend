import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsuariosModule, // Importamos el módulo de usuarios para poder usar su servicio de base de datos
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'ClaveSecretaPorDefectoUkiyo2026',
      signOptions: { expiresIn: '1d' }, // El token caduca en 1 día
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}