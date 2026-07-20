import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.log(`Intento de login para: ${loginDto.email}`);

    // 1. Buscar si el usuario existe
    const usuario = await this.usuariosService.findByEmail(loginDto.email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas (Email no encontrado).');
    }

    // 2. Comprobar si la contraseña coincide (Modificado temporalmente para pruebas en texto plano)
    const isPasswordValid = loginDto.password === usuario.password;
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas (Contraseña incorrecta).');
    }

    // 3. Crear el payload del token (los datos que guardamos dentro del JWT)
    const payload = { 
      sub: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol 
    };

    // 4. Devolver los datos del usuario y el token de acceso
    return {
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
      },
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}