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
    this.logger.log(`Intento de login para: ${loginDto.email || loginDto.nombre}`);

    // 0. Debe llegar al menos un identificador (email o nombre)
    if (!loginDto.email && !loginDto.nombre) {
      throw new UnauthorizedException('Debes indicar tu email o tu nombre de usuario.');
    }

    // 1. Buscar el usuario por email o por nombre, según lo que se haya enviado
    const usuario = loginDto.email
      ? await this.usuariosService.findByEmail(loginDto.email)
      : await this.usuariosService.findByNombre(loginDto.nombre!);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas (Usuario no encontrado).');
    }

    // 2. Comprobar si la contraseña coincide utilizando Bcrypt de forma segura
    const isPasswordValid = await bcrypt.compare(loginDto.password, usuario.password);
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
    // OJO: se llama "user" (no "usuario") para que coincida con lo que espera el frontend
    return {
      user: {
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