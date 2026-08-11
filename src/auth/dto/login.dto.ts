export class LoginDto {
  email?: string;    // Opcional: se usa si el usuario inicia sesión con su correo
  nombre?: string;   // Opcional: se usa si el usuario inicia sesión con su nombre de usuario
  password!: string;
}