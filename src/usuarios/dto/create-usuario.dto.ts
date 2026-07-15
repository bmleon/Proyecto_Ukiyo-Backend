export class CreateUsuarioDto {
  nombre!: string;
  apellidos?: string; // Opcional al registrarse
  email!: string;
  password?: string;  // Opcional por si en el futuro usas OAuth (Google), pero obligatorio para registro clásico
  rol?: string;       // Opcional, por defecto será 'USER'
  telefono?: string;  // Opcional
  direccion?: string; // Opcional
}